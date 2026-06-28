import shutil
import pytest
from pathlib import Path

from app.core.subprocess_run import run_cmd, ToolError
from app.core.validation import ValidationError
from app.tools import ocr

requires_ocrmypdf = pytest.mark.skipif(
    shutil.which("ocrmypdf") is None, reason="ocrmypdf non installé (testé en conteneur)"
)


def test_run_cmd_success():
    run_cmd(["true"])  # ne lève rien


def test_run_cmd_nonzero_raises():
    with pytest.raises(ToolError) as e:
        run_cmd(["false"])
    assert e.value.code == "process_failed"


def test_run_cmd_timeout_raises():
    with pytest.raises(ToolError) as e:
        run_cmd(["sleep", "5"], timeout=1)
    assert e.value.code == "timeout"


def _write_min_pdf(p: Path) -> None:
    # PDF 1 page minimal valide
    p.write_bytes(
        b"%PDF-1.4\n"
        b"1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
        b"2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
        b"3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\n"
        b"xref\n0 4\n0000000000 65535 f \n"
        b"trailer<</Root 1 0 R/Size 4>>\n%%EOF\n"
    )


def test_ocr_rejects_bad_lang(tmp_path):
    src = tmp_path / "in.pdf"
    _write_min_pdf(src)
    with pytest.raises(ValidationError) as e:
        ocr.run([src], {"lang": "klingon"}, tmp_path)
    assert e.value.code == "bad_param"


@requires_ocrmypdf
def test_ocr_produces_output(tmp_path):
    src = tmp_path / "in.pdf"
    _write_min_pdf(src)
    out = ocr.run([src], {"lang": "eng"}, tmp_path)
    assert out.exists()
    assert out.read_bytes().startswith(b"%PDF")
