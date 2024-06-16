from api.models import User


def get(login: str) -> User:
    return User.query.filter_by(login=login).one_or_none()


def find(login: str, password: str) -> User:
    return User.query.filter_by(login=login, password=password).one_or_none()
