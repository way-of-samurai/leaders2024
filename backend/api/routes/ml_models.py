from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from api.services.ml_models import active_model, new_model

ml_models = Blueprint("ml_models", __name__)


@ml_models.route("/config", methods=['POST'])
@jwt_required()
def setup():
    system_promt = request.form.get("system_promt")
    sd_weights = request.files.get("weights")
    model = new_model(system_promt, sd_weights.read() if sd_weights else None)
    return jsonify(model)


@ml_models.route("/active", methods=['GET'])
@jwt_required()
def get_active_model():
    return jsonify(active_model())
