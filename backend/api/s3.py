import os
import tempfile
from pathlib import Path

import s3fs

fs = s3fs.S3FileSystem(default_cache_type=None, use_listings_cache=False, default_fill_cache=False)


def download_to_tmp(path: str) -> Path:
    to_path = os.path.join(tempfile.gettempdir(), path.split("/")[-1])
    fs.get_file(path, to_path)
    return Path(to_path)
