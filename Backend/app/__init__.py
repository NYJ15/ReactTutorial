"""Init file

This file initializes the flask application and creates all the database
tables in the database.
"""

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config.from_pyfile('../config.py')
jwt = JWTManager(app)

from app.models import Base, engine, db

Base.metadata.create_all(bind=engine)

from app.user.resources import mod_user
from app.images.resources import mod_images
from app.tags.resources import mod_tags
from app.albums.resource import mod_albums
app.register_blueprint(mod_user)
app.register_blueprint(mod_images)
app.register_blueprint(mod_tags)
app.register_blueprint(mod_albums)

app.after_request


def after_request(response):
    """This function handles the CORS requests"""
    response.headers.set('Access-Control-Allow-Origin',
                         '*')
    response.headers.add("Access-Control-Allow-Headers",
                         "x-requested-with, Content-Type, authorization")
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response


CORS(app, supports_credentials=True)


@app.errorhandler(404)
def not_found(error):
    """This function handles not found error."""
    return '{"Message": "Not found"}', error, 404
