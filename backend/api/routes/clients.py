import uuid
from typing import Any

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from api.models import Client
from api.services.clients import merge, get, get_all

clients = Blueprint("clients", __name__)


@clients.route('/', methods=['POST'])
@jwt_required()
def upsert():
    params = request.get_json()
    client = Client(id=params.get("id", uuid.uuid4()), features=params["features"])
    return jsonify(__map(merge(client)))


@clients.route('/', methods=['GET'])
@jwt_required()
def list_clients():
    return jsonify(map(__map, get_all()))


@clients.route('/<uuid:client_id>', methods=['GET'])
@jwt_required()
def get_client(client_id: uuid.UUID):
    return jsonify(__map(get(client_id)))


def __map(client: Client) -> dict[Any, Any]:
    return {
        "id": client.id,
        "features": client.features
    }
