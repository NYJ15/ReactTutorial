"""
Boto client
"""

import boto3
from botocore.client import Config
from config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION


s3cli = boto3.client('s3',
                     region_name=AWS_REGION,
                     config=Config(signature_version='s3v4'),
                     aws_access_key_id=AWS_ACCESS_KEY_ID,
                     aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
