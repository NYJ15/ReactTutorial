"""
APIs for managing images.
"""
import datetime
import uuid
import pytz
from flask import Blueprint, request
from flask_restful import Resource, Api
from flask_jwt_extended import get_jwt_identity, jwt_required
from es_connection import get_es_object
from boto_cred import s3cli
from app.models import db, User, UserAlbums
from app.utils import detect_text, generate_tags


mod_images = Blueprint("images", __name__)
api_images = Api()
api_images.init_app(mod_images)


class UploadImage(Resource):
    """
      APIs to upload and get images.
    """
    # @jwt_required()
    def get(self, image_id):
        """
        :param image_id: Image ID
        :return: Returns the image
        """
        try:
            # current_user = get_jwt_identity()
            current_user = {}
            current_user['id'] = 1
            user = User.query.filter_by(id=current_user['id']).first()
            if user is None:
                return {"result": "User does not exist."}, 404

            es_db = get_es_object()
            image = es_db.get(index="images", id=image_id)

            return {"images": image}
        except KeyError as error:
            return {"result": "Key error", "error": str(error)}, 400
        except Exception as error:
            return {"result": "Exception occurred", "error": str(error)}, 400

    # @jwt_required()
    def post(self):
        """
        Uploads the image to the system.
        """
        try:
            # current_user = get_jwt_identity()
            current_user = {}
            current_user['id'] = 1
            user = User.query.filter_by(id=current_user['id']).first()
            if user is None:
                return {"error": "User does not exist."}, 404

            file = request.files['file']
            tags = request.form['tags']
            album = request.form['album']
            full_name = file.filename
            bucket_name = user.username.lower()

            if album == "undefined":
                return {"result": "Album can't be empty"}, 500
            if tags == "undefined":
                tags = ""

            if not user.bucket_created:
                s3cli.create_bucket(Bucket=bucket_name)
                user.bucket_created = True
                db.commit()

            s3cli.put_object(Bucket=bucket_name, Body=file, Key=full_name,
                             ACL='public-read')

            s3_path = f'https://{bucket_name}.s3.us-east-2.amazonaws.com' \
                      f'/{full_name}'

            extracted_text = detect_text(s3_path)

            if extracted_text == "No text":
                auto_tags = generate_tags(s3_path)
                if tags == "":
                    tags += auto_tags
                else:
                    tags += "," + auto_tags

            es_dict = {
                "user_id": user.id,
                "album": album.lower(),
                "path": s3_path,
                "name": full_name,
                "tags": list(set(tags.split(',') if len(tags) > 0 else [])),
                "text": extracted_text if extracted_text != "No text" else "",
                "uploaded_on": datetime.datetime.now(pytz.timezone(
                    'America/New_York')).strftime("%Y-%m-%d %H:%M:%S")
            }

            es_db = get_es_object()
            es_db.index(index="images", op_type='index', id=uuid.uuid4(
            ).hex, body=es_dict)

            album_obj = UserAlbums.query.filter(UserAlbums.album_name ==
                                                album, UserAlbums.user_id
                                                  == user.id).first()

            if album_obj is None:
                album_obj = UserAlbums(
                    user_id=user.id,
                    album_name=album,
                    path="/" + album,
                )
                db.add(album_obj)
                db.commit()

            return {"result": "Successfully stored file.",
                    "album_id": album_obj.id}

        except KeyError as error:
            return {"result": "Key error", "error": str(error)}, 400
        except Exception as error:
            return {"result": "Exception occurred", "error": str(error)}, 400

    # @jwt_required()
    def put(self, image_id):
        """
        Updates the image.
        """
        try:
            # current_user = get_jwt_identity()
            current_user = {}
            current_user['id'] = 1
            user = User.query.filter_by(id=current_user['id']).first()
            if user is None:
                return {"error": "User does not exist."}, 404

            tags = request.form['tags']
            if tags == "undefined":
                tags = ""

            es_db = get_es_object()
            image = es_db.get(index="images", id=image_id)

            tags = list(set(image['_source']['tags'] +
                            list(set(tags.split(',') if len(tags) > 0
                                     else []))))

            album = UserAlbums.query.filter(UserAlbums.album_name == image[
                '_source']['album'].lower(), UserAlbums.user_id ==
                                            user.id).first()

            print(tags)

            es_dict = {
                "tags": tags,
                "updated_on": datetime.datetime.now(pytz.timezone(
                    'America/New_York')).strftime("%Y-%m-%d %H:%M:%S")
            }

            es_db.update(index="images", id=image_id, body={"doc": es_dict})

            return {"result": "Successfully updated the file.", "album_id":
                album.id}

        except TypeError as error:
            return {"result": "Key error", "error": str(error)}, 400
        # except Exception as error:
        #     return {"result": "Exception occurred",
        #             "error": str(error)}, 400

    # @jwt_required
    def delete(self, image_id):
        """
                Uploads the image to the system.
                """
        try:
            # current_user = get_jwt_identity()
            current_user = {}
            current_user['id'] = 1
            user = User.query.filter_by(id=current_user['id']).first()
            if user is None:
                return {"error": "User does not exist."}, 404

            es_db = get_es_object()
            es_db.delete(index="images", id=image_id)

            return {"result": "Successfully deleted image."}

        except KeyError as error:
            return {"result": "Key error", "error": str(error)}, 400
        except Exception as error:
            return {"result": "Exception occurred", "error": str(error)}, 400


api_images.add_resource(UploadImage, '/upload_image',
                        '/image/<string:image_id>')
