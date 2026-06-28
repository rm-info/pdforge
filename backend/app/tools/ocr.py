from pathlib import Path
from app.core.subprocess_run import run_cmd
from app.core.validation import ValidationError

ALLOWED_LANGS = {"fra", "eng", "fra+eng"}


def run(input_paths: list[Path], params: dict, workdir: Path) -> Path:
    lang = params.get("lang", "fra")
    if lang not in ALLOWED_LANGS:
        raise ValidationError("bad_param", "Langue OCR non supportée")
    src = input_paths[0]
    out = workdir / "out.pdf"
    run_cmd(
        ["ocrmypdf", "-l", lang, "--force-ocr", str(src), str(out)],
        timeout=300,
    )
    return out
