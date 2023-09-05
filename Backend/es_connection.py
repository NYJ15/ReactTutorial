"""
ElasticSearch connection
"""
from elasticsearch import Elasticsearch
import urllib3
from config import ES_URL

urllib3.disable_warnings()


def get_es_object():
    """
    Create elasticsearch object
    :return: elasticsearch object
    """
    elasticsearch_object = Elasticsearch(ES_URL, timeout=60,
                                         max_retries=10, retry_on_timeout=True)
    return elasticsearch_object
