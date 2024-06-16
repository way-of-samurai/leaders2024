import uuid
from typing import Any

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from api.models import db, Client

clients = Blueprint("clients", __name__)


@clients.route('/', methods=['POST'])
@jwt_required()
def upsert():
    params = request.get_json()
    client = Client(id=params.get("id", uuid.uuid4()), features=params["features"])
    merged = db.session.merge(client)
    db.session.commit()
    return jsonify(__map(merged))


@clients.route('/', methods=['GET'])
@jwt_required()
def upsert():
    return jsonify(map(__map, Client.query.all()))


@clients.route('/<uuid:client_id>', methods=['GET'])
@jwt_required()
def get(client_id: uuid.UUID):
    client = Client.query.filter_by(id=client_id).one_or_404()
    return jsonify(__map(client))


def __map(client: Client) -> dict[Any, Any]:
    return {
        "id": client.id,
        "features": client.features
    }
