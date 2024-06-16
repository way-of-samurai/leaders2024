import logging
import os
from distutils.util import strtobool
from pathlib import Path

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

from api.ml.llm import default_template
from api.routes.clients import clients
from api.routes.images import images
from api.routes.ml_models import ml_models
from api.routes.recommendations import recommendations
from api.services.ml_models import init_models, active_model, save_default_model

log = logging.getLogger(__name__)


def create_app():
    app = Flask(__name__)

    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DB_URL", "sqlite://")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    from api.models import db
    db.init_app(app)
    with app.app_context():
        __migration(db, Path(__file__).parent / "sql" / "init.sql")

    from api.auth import jwt
    jwt.init_app(app)

    if bool(strtobool(os.environ.get("ACTIVATE_MODELS", "true"))):
        with app.app_context():
            default_model = active_model()
            if default_model is None:
                default_weights_path = os.environ["DEFAULT_SD_WEIGHTS_PATH"]
                default_model = save_default_model(default_template, default_weights_path)
            init_models(default_model)

    app.register_blueprint(ml_models, url_prefix="/models")
    app.register_blueprint(recommendations, url_prefix="/recommendations")
    app.register_blueprint(images, url_prefix="/images")
    app.register_blueprint(clients, url_prefix="/clients")
    return app


def __migration(db: SQLAlchemy, path: str | Path):
    with db.engine.connect() as conn:
        with open(path) as sql:
            for stmnt in sql.read().split(";"):
                if stmnt.strip():
                    conn.execute(text(stmnt + ";"))
        conn.commit()
