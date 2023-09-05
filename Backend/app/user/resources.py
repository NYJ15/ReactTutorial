import json
import bcrypt
import datetime
import pytz

from flask import Blueprint, request
from flask_restful import Resource, Api
from flask_jwt_extended import create_access_token, get_jwt_identity, \
    jwt_required
from app.models import db, User
from app.utils import AlchemyEncoder

mod_user = Blueprint("user", __name__)
api_user = Api()
api_user.init_app(mod_user)


class Register(Resource):
    """APIs to create and get user."""

    @jwt_required
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(id=current_user['id']).first()
        if user is None:
            return {"result": "User does not exist."}, 404
        else:
            user_obj = json.dumps(user, cls=AlchemyEncoder)
            return {"result": json.loads(user_obj)}

    def post(self):
        data = request.get_json()
        try:
            user_exists = User.query.filter_by(email=data["email"].lower(
            )).first()
            if user_exists is None:
                password = data["password"]
                password_hash = bcrypt.hashpw(password, bcrypt.gensalt())

                user = User(email=data["email"].lower(),
                            password=password_hash,
                            username=data["username"],
                            first_name=data["first_name"],
                            last_name=data["last_name"],
                            created_at=datetime.datetime.now(
                                pytz.timezone('UTC'))
                            )
                db.add(user)
                db.commit()

                return {"result": "Account created successfully.",
                        "id": user.id,
                        "email": user.email}
            else:
                return {"result": "The user already exists."}, 500

        except KeyError as e:
            return {"result": "Key error", "error": str(e)}, 400
        except IndexError as e:
            return {"result": "Index error", "error": str(e)}, 400


class Login(Resource):
    """API to login user."""

    def get(self):
        return {"hello": "working"}

    def post(self):
        data = request.get_json()
        try:
            user = User.query.filter_by(email=data["email"]).first()
            if user is None:
                return {"result": "The user does not exist."}, 404
            else:
                match = bcrypt.checkpw(data["password"], user.password)
                if not match:
                    return {"result": "Invalid password."}, 500

            data_token = {"id": user.id, "email": user.email,
                          "username": user.username}

            expires = datetime.timedelta(hours=4)
            token = create_access_token(identity=data_token,
                                        expires_delta=expires)

            return {"result": "Successfully logged in.",
                    "access_token": token, "email": user.email,
                    "username": user.username}

        except KeyError as e:
            return {"result": "Key error", "error": str(e)}, 400


api_user.add_resource(Register, '/register')
api_user.add_resource(Login, '/login')
