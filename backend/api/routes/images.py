from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from api.models import db
from api.services.images import save_image

images = Blueprint("images", __name__)


@images.route('/upload', methods=['POST'])
@jwt_required()
def upload_style():
    files = request.files.getlist("file")
    for file in files:
        save_image(file.filename, file.read(), commit=False)
    db.session.commit()
