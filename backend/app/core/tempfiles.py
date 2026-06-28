import shutil
import tempfile
from contextlib import contextmanager
from pathlib import Path


@contextmanager
def temp_workdir():
    d = Path(tempfile.mkdtemp(prefix="pdforge-"))
    try:
        yield d
    finally:
        shutil.rmtree(d, ignore_errors=True)
