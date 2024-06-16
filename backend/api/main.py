import os
from datetime import timedelta
from typing import Final

from distutils.util import strtobool
from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, current_user

from api.app import create_app
from api.models import db, User

app = create_app()


@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()


@app.route('/login', methods=['POST'])
def login():
    if request.is_json:
        user_login = request.json['login']
        password = request.json['password']
    else:
        user_login = request.form['login']
        password = request.form['password']

    user = User.query.filter_by(login=user_login, password=password).one_or_none()
    if user:
        access_token = create_access_token(identity=user, expires_delta=timedelta(hours=1))
        return jsonify(message='Login Successful', access_token=access_token)
    else:
        return jsonify('Bad email or Password'), 401


@app.route('/current_user', methods=['GET'])
@jwt_required()
def get_current_user():
    user = current_user
    return jsonify({"id": user.id, "login": user.login, "role": user.role})


if __name__ == '__main__':
    DEBUG: Final[bool] = bool(strtobool(os.environ.get('DEBUG', "True")))
    app.run(host="0.0.0.0", debug=DEBUG)
