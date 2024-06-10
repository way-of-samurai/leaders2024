import uuid

from api.ml.image_generator import set_weights, init_model as init_sd_model
from api.ml.llm import change_system_promt, init_model as init_llm_model
from api.models import Model, db
from api.s3 import fs

__base_factor_path = "s3://sd/"
__active_model: Model | None = None


def active_model() -> Model | None:
    global __active_model
    if __active_model is None:
        __active_model = Model.query.filter_by(is_active=True).one_or_none()
    return __active_model


def save_default_model(system_promt: str, weights_path: str) -> Model:
    model = Model(id=uuid.uuid4(), is_active=True, system_promt=system_promt, weights_path=weights_path)
    db.session.add(model)
    db.session.commit()
    return model


def new_model(system_promt: str | None, sd_weights: bytes | None) -> Model:
    model_id = uuid.uuid4()
    active = active_model()
    weights_path = active.weights_path
    if sd_weights:
        weights_path = __base_factor_path + str(model_id)
        fs.write_bytes(weights_path, sd_weights)
    active.is_active = False
    model = Model(id=model_id, is_active=True, system_promt=system_promt or active.system_promt,
                  weights_path=weights_path)
    db.session.add(model)
    db.session.commit()
    if system_promt:
        change_system_promt(system_promt)
    if sd_weights:
        set_weights(weights_path)
    global __active_model
    __active_model = model
    return model


def init_models(model: Model):
    init_sd_model(model)
    init_llm_model(model)
