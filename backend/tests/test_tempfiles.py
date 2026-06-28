import pytest
from pathlib import Path
from app.core.tempfiles import temp_workdir


def test_creates_and_removes_dir():
    seen = None
    with temp_workdir() as wd:
        assert isinstance(wd, Path)
        assert wd.is_dir()
        seen = wd
    assert not seen.exists()


def test_removes_dir_on_exception():
    seen = None
    with pytest.raises(RuntimeError):
        with temp_workdir() as wd:
            seen = wd
            (wd / "f.txt").write_text("x")
            raise RuntimeError("boom")
    assert not seen.exists()
