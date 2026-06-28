import pytest
from app.core.validation import validate_pdf, ValidationError, MAX_BYTES


def test_accepts_valid_pdf_header():
    validate_pdf(b"%PDF-1.7\n...")  # ne lève rien


def test_rejects_empty():
    with pytest.raises(ValidationError) as e:
        validate_pdf(b"")
    assert e.value.code == "empty"


def test_rejects_non_pdf():
    with pytest.raises(ValidationError) as e:
        validate_pdf(b"GIF89a not a pdf")
    assert e.value.code == "not_pdf"


def test_rejects_too_large():
    with pytest.raises(ValidationError) as e:
        validate_pdf(b"%PDF-" + b"0" * (MAX_BYTES + 1))
    assert e.value.code == "too_large"
