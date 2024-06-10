import os.path
import uuid

from api.models import db, Image
from api.s3 import fs

__s3_bucket = "s3://images/"


def save_image(name: str, data: bytes, commit: bool = True) -> Image:
    image_id = uuid.uuid4()
    path = __s3_bucket + str(image_id) + name.split(".")[1]
    fs.write_bytes(path, data)
    image = Image(id=image_id, name=name, path=path)
    db.session.add(image)
    if commit:
        db.session.commit()
    return image
