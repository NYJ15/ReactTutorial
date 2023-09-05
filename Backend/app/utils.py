"""Utils
This file contains different utility functions that are useful for performing
certain functions.

The Alchemy Encoder class is used to format the result of sqlalchemy queries.
"""

import json
import pytz
import requests
from sqlalchemy.ext.declarative import DeclarativeMeta
from google.cloud import vision


class AlchemyEncoder(json.JSONEncoder):
    """A JSON encoder that takes a sqlalchemy result object and converts it
    into a JSON encode dict of the form 'column': 'value' using the model
    information.
    """

    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            # an SQLAlchemy class
            fields = {}
            first_name = None
            last_name = None
            timezone = pytz.timezone('America/New_York')
            for field in [x for x in dir(obj) if
                          not x.startswith('_') and x != 'metadata']:
                data = obj.__getattribute__(field)
                if field in ["password", "keys", "query", "query_class"]:
                    pass
                else:
                    try:
                        if field in ["created_at"]:
                            data = pytz.utc.localize(
                                data, is_dst=None).astimezone(timezone)

                            fields[field] = data.strftime("%m/%d/%Y, %H:%M:%S")
                        elif field == "first_name":
                            first_name = data
                        elif field == "last_name":
                            last_name = data
                        else:
                            if first_name is not None and last_name is not \
                                    None:
                                fields['name'] = first_name + ' ' + last_name

                            json.dumps(data)
                            fields[field] = data.strip()

                    except TypeError:
                        fields[field] = str(data)
                    except AttributeError:
                        fields[field] = data

            return fields
        return json.JSONEncoder.default(self, obj)


def detect_text(uri):
    """Detects text in the file."""
    client = vision.ImageAnnotatorClient()
    image = vision.Image()
    image.source.image_uri = uri

    response = client.text_detection(image=image)
    texts = response.text_annotations

    if len(texts) == 0:
        return "No text"

    return texts[0].description


def generate_tags(uri):
    url = "https://api.imagga.com/v2/tags"

    querystring = {
        "image_url": uri,
        "version": "2"
    }

    headers = {
        'accept': "application/json",
        'authorization': "Basic YWNjX2IwYThhMTRiODNkNjg3YTo3ZjNkMzFmYTBiMzAyYzMzZGE1NWFiZGFkNjNjNWRlZg=="
    }

    response = requests.request("GET", url, headers=headers,
                                params=querystring)

    rep = json.loads(response.text)

    return rep['result']['tags'][0]['tag']['en']
