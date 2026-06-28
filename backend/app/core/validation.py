PDF_MAGIC = b"%PDF-"
MAX_BYTES = 100 * 1024 * 1024  # 100 Mo


class ValidationError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


def validate_pdf(data: bytes) -> None:
    if len(data) == 0:
        raise ValidationError("empty", "Fichier vide")
    if len(data) > MAX_BYTES:
        raise ValidationError("too_large", "Fichier trop volumineux (max 100 Mo)")
    if not data.startswith(PDF_MAGIC):
        raise ValidationError("not_pdf", "Le fichier n'est pas un PDF valide")
