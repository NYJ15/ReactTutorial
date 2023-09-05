"""
APIs for managing tags.
"""
from flask import Blueprint, request
from flask_restful import Resource, Api
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models import User, UserAlbums
from es_connection import get_es_object

mod_tags = Blueprint("tags", __name__)
api_tags = Api()
api_tags.init_app(mod_tags)


class Tags(Resource):
    """
      API to search images based on tags.
    """

    # @jwt_required()
    def post(self):
        """
          APIs to search images based on tags.
        """
        try:
            # current_user = get_jwt_identity()
            current_user = {}
            current_user['id'] = 1
            user = User.query.filter_by(id=current_user['id']).first()
            if user is None:
                return {"result": "User does not exist."}, 404

            search_word = request.get_json()['search']
            album_id = request.get_json()['album_id'] \
                if 'album_id' in request.get_json() else ""
            parameter = request.get_json()['parameter']

            album = ""
            if album_id != "":
                album_obj = UserAlbums.query.filter(UserAlbums.id ==
                                                    album_id).first()
                album = album_obj.album_name

            if parameter == "text" and search_word == "":
                parameter = "tags"

            if parameter == "both":
                query_ = {
                    "query_string":
                        {
                            "query": search_word + "*"
                        }
                }
            else:
                query_ = {
                    "bool": {
                        "must": [
                            {"wildcard": {parameter: search_word + "*"}},
                            {"wildcard": {"album": "*" + album + "*"}}
                        ]
                    }
                }

            es_db = get_es_object()
            query = {
                "from": 0,
                "size": 50,
                "track_total_hits": True,
                "query": query_,
                "sort": [
                    {"uploaded_on.keyword": {"order": "desc"}}
                ]
            }

            images_obj = es_db.search(index="images", body=query)
            if images_obj['hits']['total']['value'] == 0:
                return {"images": []}

            images_obj = images_obj['hits']['hits']
            return {"images": images_obj}

        except KeyError as error:
            return {"result": "Key error", "error": str(error)}, 400

        except Exception as error:
            return {"result": "Exception occurred", "error": str(error)}, 400


api_tags.add_resource(Tags, '/search_tags')
