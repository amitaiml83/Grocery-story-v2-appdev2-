from datetime import datetime
import uuid
from flask import current_app as app,jsonify,request,render_template,send_file
from flask_security import auth_required,roles_required,roles_accepted,current_user
from werkzeug.security import check_password_hash,generate_password_hash
from flask_restful import fields, marshal
import flask_excel as excel
from celery.result import AsyncResult
from .tasks import create_resource_csv
from.models import db, User,Role,Category,Product,CartItem,Order,Transaction
from .sec import datastore




@app.get('/')
def home():
    return render_template("index.html")


@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return "welcome to admin home page"

@app.get('/activate/manager/<int:mang_id>')
@auth_required("token")
@roles_required("admin")
def activate_user(mang_id):
    managers = User.query.get(mang_id)
    if not managers or "manager" not in managers.roles:
        return jsonify({"message":"Manager not found"}),404
    managers.active = True
    db.session.commit()
    return jsonify({"message":"User Activated"}),200

@app.get('/deactivate/user/<int:user_id>')
@auth_required("token")
@roles_required("admin")
def deactivate_user(user_id):
    users = User.query.get(user_id)
    if not users or "manager" not in users.roles:
        return jsonify({"message":"User not found"}),404
    users.active = False
    db.session.commit()
    return jsonify({"message":"User Deactivated"}),200

@app.get('/activate/category/<int:cat_id>')
@auth_required("token")
@roles_required("admin")
def activate_category(cat_id):
    category = Category.query.get(cat_id)
    if not category:
        return jsonify({"message":"category not found"}),404
    category.active = True
    db.session.commit()
    return jsonify({"message":"Category Activated"}),200

@app.get('/reject/category/<int:cat_id>')
@auth_required("token")
@roles_required("admin")
def remove_category(cat_id):
    category = Category.query.get(cat_id)
    if not category:
        return jsonify({"message":"category not found"}),404
    db.session.delete(category)
    db.session.commit()
    return jsonify({"message":"Category Deleted succesfully"}),200

@app.post('/user-login')
def userlogin():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message":"email not provides"}),404
    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message":"User not found"}),404
    
    if check_password_hash(user.password,data.get("password")):
        return jsonify({"token":user.get_auth_token(), "email":user.email,"role":user.roles[0].name}),200
    
    else:
        return jsonify({"message":"Wrong password"}),404

user_fields ={
    "id":fields.Integer,
    "email":fields.String,
    "active":fields.Boolean
}
@app.get('/users')
@auth_required("token")
@roles_required("admin")
def all_users():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message":"No user Found"}),404
    return marshal(users,user_fields)


@app.post('/user_sign_up')
def usersignup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    roles = data.get('role')

    if not email or not password or not roles:
        return jsonify({"message":"plz Provide the all the details"}),400
    
    existing_user = datastore.find_user(email=email)
    if existing_user:
        return jsonify({"message":"User alredy register plz provide different email"}),409
    
    if roles == "manager":
        new_user = datastore.create_user(email=email, password=generate_password_hash(password), roles=[roles], active=False,fs_uniquifier=str(uuid.uuid4()))
    else:
        new_user = datastore.create_user(email=email, password=generate_password_hash(password), roles=[roles],fs_uniquifier=str(uuid.uuid4()))
    
    # db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully", "user_email": new_user.email}), 201


category_fields ={
    "id":fields.Integer,
    "Name":fields.String,
    "active":fields.Boolean
}  
@app.get('/allcategory')
@auth_required("token")
@roles_accepted("admin", "manager")
def all_category():
    category = Category.query.all()
    if len(category) == 0:
        return {"message":"No category created"},404
    return marshal(category,category_fields)


@app.route('/delete/category/<int:c_id>', methods=['DELETE'])
def delete_category(c_id):
    category = Category.query.get(c_id)

    if category:
        # Delete associated products first
        for product in category.products:
            db.session.delete(product)

        # Now, delete the category
        db.session.delete(category)
        db.session.commit()
        
        return {"message": "Category and associated products deleted successfully"}, 200
    else:
        return {"message": "Category not found"}, 404

product_fields ={
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'manufacturing_date': fields.DateTime,
    'rate_per_unit': fields.Integer,
    'quantity': fields.Integer,
    'unit': fields.String,
    'product_category':fields.Integer,
}
@app.get('/allproducts')
@auth_required("token")
@roles_accepted("manager","user")
def all_products():
    products = Product.query.all()
    if len(products) == 0:
        return {"message":"No Product created"},404
    return marshal(products,product_fields)

@app.route('/delete/product/<int:p_id>', methods=['DELETE'])
@auth_required("token")
@roles_required("manager")
def delete_product(p_id):
    product = Product.query.get(p_id)

    if product is None:
        return jsonify({"message":"No product Found"})

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product deleted successfully"}), 200

cart_fields = {
    "id":fields.Integer,
    "product_id":fields.Integer,
    "product_name":fields.String,
    "price_per_item":fields.Integer,
    "quantity":fields.Integer, 
}
@app.get('/allcarts')
@auth_required("token")
# @roles_accepted("manager","user")
def all_cart():
    id = current_user.id
    products = CartItem.query.filter_by(user_id=id).all()
    if len(products) == 0:
        return {"message":"No Product carted"},404
    return marshal(products,cart_fields)

@app.post('/buy-all')
@auth_required("token")
def buy_all():
    try:
        user_id = current_user.id
        cart_items = CartItem.query.filter_by(user_id=user_id).all()

        if not cart_items:
            return jsonify({"message": "No items in the cart"}), 400

        # Assuming you have an Order model for recording orders
        order = Order(user_id=user_id, order_date=datetime.strptime(datetime.utcnow().isoformat(), "%Y-%m-%dT%H:%M:%S.%f"))
        db.session.add(order)
        db.session.commit()

        # Process each cart item and update inventory, record transaction details, etc.
        for cart_item in cart_items:
            # Example: Update product inventory (you should implement this based on your data model)
            product = Product.query.get(cart_item.product_id)
            if product:
                product.quantity -= cart_item.quantity
                

            # Example: Record the transaction details (you should implement this based on your data model)
            transaction = Transaction(
                user_id=user_id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price_per_item=cart_item.price_per_item,
                total_amount=cart_item.price_per_item * cart_item.quantity,
                transaction_date=datetime.strptime(datetime.utcnow().isoformat(), "%Y-%m-%dT%H:%M:%S.%f")
            )
            db.session.add(transaction)

            # Clear the user's cart after successful purchase
            db.session.delete(cart_item)

        db.session.commit()

        return jsonify({"message": "All items purchased successfully,We will delivered shortely"}), 200
    except Exception as e:
        print(f"Error during purchase: {str(e)}")
        db.session.rollback()
        return jsonify({"message": "Error during purchase"}), 500

@app.put('/profile-update')   
@auth_required("token")
@roles_accepted("user")
def update_profile():
    id =current_user.id
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.get(id)
    if not user:
        return jsonify({"messsage":"user not found"})
    user.email = email
    user.password = generate_password_hash(password)
    db.session.commit()
    return jsonify({"message":"Update Succesfully"})


@app.get('/download-csv')
def downlaod_csv():
    task = create_resource_csv.delay()
    return jsonify({"task_id":task.id})


@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res =AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename,as_attachment=True)
    else:
        return jsonify({"messsage":"task Pending"}),404