import uuid
from datetime import datetime
from typing import Any

import sqlalchemy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, JSON, TIMESTAMP, ARRAY
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

db = SQLAlchemy()


# declarative base class
class Base(DeclarativeBase):
    type_annotation_map = {
        dict[str, Any]: JSON
    }


# an example mapping using the base
class Image(db.Model):
    __tablename__ = "images"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    path: Mapped[str]


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    user_id: Mapped[uuid.UUID]
    client_id: Mapped[uuid.UUID]
    image_id: Mapped[uuid.UUID]
    model_id: Mapped[uuid.UUID]
    product_features: Mapped[dict[str, Any]]
    user_promt: Mapped[str]
    keywords: Mapped[str]
    rating: Mapped[int]
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=sqlalchemy.text('now()')
    )


class Client(Base):
    __tablename__ = "clients"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    features: Mapped[dict[str, Any]]


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    login: Mapped[str]
    password: Mapped[str]


class Model(db.Model):
    __tablename__ = "models"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    is_active: Mapped[bool]
    system_promt: Mapped[str]
    weights_path: Mapped[str]
