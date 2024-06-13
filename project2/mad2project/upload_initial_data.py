import uuid
from main import app
from application.sec import datastore
from application.models import db,Role
# from flask_security import hash_password
from werkzeug.security import generate_password_hash


with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="User is an admin")
    datastore.find_or_create_role(name="manager", description="User is an Manager")
    datastore.find_or_create_role(name="user", description="User is a Buyer")
    db.session.commit()
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(email="admin@email.com", password=generate_password_hash("admin"), roles=["admin"],fs_uniquifier=str(uuid.uuid4()))
    if not datastore.find_user(email="manager1@email.com"):
        datastore.create_user(email="manager1@email.com", password=generate_password_hash("manger1"), roles=["manager"], active=False,fs_uniquifier=str(uuid.uuid4()))
    if not datastore.find_user(email="user1@email.com"):
        datastore.create_user(email="user1@email.com", password=generate_password_hash("user1"), roles=["user"],fs_uniquifier=str(uuid.uuid4()))
    db.session.commit()
