from flask_restful import Resource, Api, reqparse, fields, marshal,inputs
from flask_security import auth_required, roles_required, current_user,roles_accepted
from flask import jsonify
from sqlalchemy import or_
from .models import Category, db,Product,CartItem
from .instances import cache


api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument('Name', type=str,help='Name is required should be a string')


class Creator(fields.Raw):
    def format(self, user):
        return user.email

category_create_fields = {
    'id': fields.Integer,
    'Name': fields.String,
    'active': fields.Boolean,
    'creator': Creator
}

class Category_create(Resource):
    @auth_required("token")
    @cache.cached(timeout=50)
    def get(self):
        categories = Category.query.all()
        if categories:
            return marshal(categories, category_create_fields)
        else:
            return jsonify({"message": "No Resource Found"}), 404

    @auth_required("token")
    @roles_accepted("admin", "manager")
    def post(self):
        args = parser.parse_args()
        if current_user.has_role("manager"):
            category = Category(Name=args.get("Name"), active=False, creator_id=current_user.id)
        else:
            category = Category(Name=args.get("Name"), active=True,creator_id=current_user.id)

        db.session.add(category)
        db.session.commit()
        if current_user.has_role("manager"):
            return {"message": "Category is requested successfully"}
        else:
            return {"message": "Category is requested successfully"}

    @auth_required("token")
    @roles_required("admin")
    def put(self, c_id):
        args = parser.parse_args()
        category = Category.query.get(c_id)

        if not category:
            return {"message": "Category not found"}, 404

        category.Name = args.get("Name")
        db.session.commit()
        return jsonify({"message": "Category updated successfully"})

api.add_resource(Category_create, '/category_create', '/update_category/<int:c_id>')

product_parser = reqparse.RequestParser()
product_parser.add_argument('name', type=str,help='name is required should be a string', required=True)
product_parser.add_argument('description', type=str,help='description is required should be a string', required=True)
product_parser.add_argument('manufacturing_date', type=inputs.datetime_from_iso8601, help='manufacturing date is required and should be a valid datetime string', required=True)
product_parser.add_argument('rate_per_unit', type=int,help='rate_per_unit is required should be a integer', required=True)
product_parser.add_argument('quantity',type=int,help='Quntity is required should be a integer', required=True)
product_parser.add_argument('unit', type=str,help='unit is required should be a string', required=True)
product_parser.add_argument('product_category', type=int,help='product-category name is required should be a Int', required=True)

product_fields ={
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'manufacturing_date': fields.DateTime,
    'rate_per_unit': fields.Integer,
    'quantity': fields.Integer,
    'unit': fields.String,
    'product_category':fields.Integer,
    'creator': fields.Integer  
}

class Product_create(Resource):
    @auth_required("token")
    def get(self):
        products = Product.query.all()
        if len(products) > 0:
            return marshal(products, product_fields)
        else:
            return {"message": "No Product Found"}

    @auth_required("token")
    @roles_required("manager")
    def post(self):
        args = product_parser.parse_args()
        products_c = Product(name=args.get("name"),
                             description=args.get("description"),
                             manufacturing_date=args.get("manufacturing_date"),
                             rate_per_unit=args.get("rate_per_unit"),
                             quantity=args.get("quantity"),
                             unit=args.get("unit"),
                             category_id=args.get("product_category"),
                             creator_id=current_user.id)  
        db.session.add(products_c)
        db.session.commit()
        return {"message": "Product is Created successfully"}
    
    @auth_required("token")
    @roles_required("manager")
    def put(self,p_id):
        args =parser.parse_args()
        product = Product.query.get(p_id)
        if not product:
            return jsonify({"message":"No product found"})
        
        product.name = args.get("name", product.name)
        product.description = args.get("description", product.description)
        product.manufacturing_date = args.get("manufacturing_date", product.manufacturing_date)
        product.rate_per_unit = args.get("rate_per_unit", product.rate_per_unit)
        product.quantity = args.get("quantity", product.quantity)
        product.unit = args.get("unit", product.unit)
        product.category_id = args.get("product_category", product.category_id)
        product.creator_id=current_user.id
        db.session.commit()
        return jsonify({"message":"Product Updated Succesfully"})

api.add_resource(Product_create, '/create-product', '/update-prodcut/<int:p_id>')


cart_parser = reqparse.RequestParser()
cart_parser.add_argument('product_id', type=int, help='Product ID is required', required=True)
cart_parser.add_argument('quantity', type=int, help='Quantity is required and should be an integer', required=True)
cart_parser.add_argument('product_name', type=str, help='Product name  is required', required=True)
cart_parser.add_argument('price_per_item', type=int, help='Product name  is required', required=True)

cart_fields = {
    'id': fields.Integer,
    'product_id': fields.Integer,
    'product_name':fields.String,
    'quantity': fields.Integer,
    "price_per_item":fields.Integer,
    'created_at': fields.DateTime(dt_format='rfc822'),
}

class CartItemResource(Resource):
    @auth_required("token")
    @cache.cached(timeout=100)
    def get(self):
        cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
        if cart_items:
            return marshal(cart_items, cart_fields)
        else:
            return jsonify({"message": "Cart is empty"})
        

    @auth_required("token")
    @cache.cached(timeout=50)
    def post(self):
        args = cart_parser.parse_args()
        product_id = args.get("product_id")
        quantity = int(args.get("quantity"))
        
        
        cart_item = CartItem.query.filter_by(product_id=product_id, user_id=current_user.id).first()

        if cart_item:
            cart_item.quantity += quantity
            db.session.commit()
            return {"message": "Quantity updated in the cart successfully"}
        
        product_name =args.get("product_name")
        price_per_item =args.get("price_per_item")

        cart_item = CartItem(product_id=product_id, 
                             product_name=product_name,
                             price_per_item = price_per_item,
                             user_id=current_user.id, 
                             quantity=quantity)
        db.session.add(cart_item)
        db.session.commit()
        cache.clear()
        return {"message": "Item added to the cart successfully"}

    @auth_required("token")
    def delete(self, cart_item_id):
        cart_item = CartItem.query.get(cart_item_id)
        if not cart_item:
            return jsonify({"message": "Cart item not found"}), 404

        db.session.delete(cart_item)
        db.session.commit()

        return {"message": "Item removed from the cart successfully"}

api.add_resource(CartItemResource, '/cart', '/cart/<int:cart_item_id>')

search_for = reqparse.RequestParser()
search_for.add_argument('type', type=str, help='Search type is required and should be a string', required=True)
search_for.add_argument('value', type=str, help='Search value is required and should be a string', required=True)

search_got_fields ={
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'manufacturing_date': fields.DateTime,
    'rate_per_unit': fields.Integer,
    'quantity': fields.Integer,
    'category_id':fields.Integer,
}

class ProductSearch(Resource):
    @auth_required("token")
    def post(self):
        args = search_for.parse_args()
        search_type = args.get('type')
        search_value = args.get('value')

        if search_type == 'minPrice':
            products = Product.query.filter(Product.rate_per_unit >= int(search_value)).all()
        elif search_type == 'maxPrice':
            products = Product.query.filter(Product.rate_per_unit <= int(search_value)).all()
        elif search_type == 'productName':
            products = Product.query.filter(Product.name.ilike(f"%{search_value}%")).all()
        elif search_type == 'categoryName':
            products = Product.query.join(Category).filter(Category.Name.ilike(f"%{search_value}%")).all()
        else:
            return jsonify({"message": "Invalid search type"}), 400

        if products:
            return marshal(products, search_got_fields)
        else:
            return jsonify({"message": "No matching products found"})

api.add_resource(ProductSearch, '/search-product')
