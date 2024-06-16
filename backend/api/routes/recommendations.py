import uuid

from flask import Blueprint, request, jsonify
from flask_jwt_extended import current_user, jwt_required

from api.ml import llm
from api.ml.image_generator import generate_image
from api.models import db, Recommendation
from api.services import clients, ml_models

recommendations = Blueprint("recommendations", __name__)


@recommendations.route("/generate", methods=['POST'])
@jwt_required()
def generate_promo():
    params = request.get_json()
    user_promt = params["promt"]
    xy = tuple(map(lambda i: int(i), params["xy"].split(":")))
    client = clients.get(uuid.UUID(params["client_id"]))
    client_features = client.features
    product_features = params["product_features"]
    keywords = llm.generate_keywords(user_promt, client_features, product_features)
    image = generate_image(keywords, xy)
    model = ml_models.active_model()
    recommendation = Recommendation(
        id=uuid.uuid4(),
        user_id=current_user.id,
        client_id=client.id,
        image_id=image.id,
        model_id=model.id,
        keywords=keywords,
        user_promt=user_promt,
        product_features=product_features
    )
    db.session.add(recommendation)
    db.session.commit()
    return jsonify({"id": str(image.id), "name": image.name, "path": image.path})
