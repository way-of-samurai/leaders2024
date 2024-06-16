import uuid

from api.models import Client, db


def merge(client: Client) -> Client:
    merged = db.session.merge(client)
    db.session.commit()
    return merged


def get(client_id: uuid.UUID) -> Client:
    return Client.query.get_or_404(client_id)


def get_all() -> list[Client]:
    return Client.query.all()
