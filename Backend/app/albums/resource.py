"""
APIs for managing user albums.
"""
import json
from flask import Blueprint
from flask_restful import Resource, Api
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models import User, UserAlbums
from app.utils import AlchemyEncoder
from es_connection import get_es_object

mod_albums = Blueprint("albums", __name__)
api_albums = Api()
api_albums.init_app(mod_albums)


class Albums(Resource):
    """
    User Albums: Consists of albums created by the user.
    """

    # @jwt_required()
    def get(self):
        """
        :return: List of dictionary of user albums
        """
        # current_user = get_jwt_identity()
        current_user = {}
        current_user['id'] = 1
        user = User.query.filter_by(id=current_user['id']).first()
        if user is None:
            return {"result": "User does not exist."}, 404

        albums = UserAlbums.query.filter(UserAlbums.user_id == user.id).all()
        album_obj = json.dumps(albums, cls=AlchemyEncoder)
        result = []
        for album in json.loads(album_obj):
            temp_dict = {
                "album_id": album['id'],
                "album_name": album["album_name"],
                "path": album["path"]
            }
            result.append(temp_dict)

        return {"result": result}


class AlbumImages(Resource):
    """
        User Album Images: Returns the images in the given album.
    """

    # @jwt_required()
    def get(self, album_id):
        """
        :param album_id: Album ID
        :return: Returns all the images of the given album
        """
        try:
            # current_user = get_jwt_identity()
            current_user = {}
            current_user['id'] = 1
            user = User.query.filter_by(id=current_user['id']).first()
            if user is None:
                return {"result": "User does not exist."}, 404

            check_album = UserAlbums.query.filter(UserAlbums.id == album_id,
                                                  UserAlbums.user_id
                                                  == user.id).first()
            if not check_album:
                return {"result": "No such album exists"}, 500

            es_db = get_es_object()
            query = {
                "from": 0,
                "size": 50,
                "track_total_hits": True,
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match": {
                                    "user_id": user.id
                                }
                            },
                            {
                                "match": {
                                    "album.keyword": check_album.album_name
                                }
                            }
                        ]
                    }
                },
                "sort": [
                    {"uploaded_on.keyword": {"order": "desc"}}
                ]
            }

            images_obj = es_db.search(index="images", body=query)
            if images_obj['hits']['total']['value'] == 0:
                return {"result": "No images found."}, 500

            images_obj = images_obj['hits']['hits']

            return {"images": images_obj}
        except KeyError as error:
            return {"result": "Key error", "error": str(error)}, 400
        except Exception as error:
            return {"result": "Exception occurred", "error": str(error)}, 400


api_albums.add_resource(Albums, '/albums')
api_albums.add_resource(AlbumImages, '/album_images/<int:album_id>')
