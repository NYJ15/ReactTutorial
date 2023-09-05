"""Models

This file contains all the database models. Each data model represents a table
in the database and has certain columns.
"""

from sqlalchemy import String, TIMESTAMP, ForeignKey, text
from sqlalchemy.dialects.mysql import BIGINT, TINYINT
from sqlalchemy import Column, create_engine
from sqlalchemy.orm import relationship, scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from config import SQLALCHEMY_DATABASE_URI

engine = create_engine(SQLALCHEMY_DATABASE_URI, pool_size=20,
                       max_overflow=0, pool_pre_ping=True)
db = scoped_session(sessionmaker(bind=engine))
Base = declarative_base()
Base.query = db.query_property()


class User(Base):
    """User table containing login information of the user."""

    __tablename__ = 'user'

    id = Column(BIGINT(20), primary_key=True)
    username = Column(String(255, 'utf8mb4_unicode_ci'), nullable=False)
    first_name = Column(String(255, 'utf8mb4_unicode_ci'), nullable=False)
    last_name = Column(String(255, 'utf8mb4_unicode_ci'), nullable=False)
    email = Column(String(255, 'utf8mb4_unicode_ci'),
                   nullable=False, unique=True)
    password = Column(String(255, 'utf8mb4_unicode_ci'))
    bucket_created = Column(TINYINT(1), nullable=False, server_default=text(
        "'0'"))
    created_at = Column(TIMESTAMP)


class UserAlbums(Base):
    """User Albums table keeping the record of user albums."""

    __tablename__ = 'user_albums'

    id = Column(BIGINT(20), primary_key=True)
    user_id = Column(ForeignKey('user.id', ondelete='CASCADE'),
                     nullable=False, index=True)
    album_name = Column(String(255, 'utf8mb4_unicode_ci'), nullable=False)
    path = Column(String(255, 'utf8mb4_unicode_ci'))

    user = relationship('User')
