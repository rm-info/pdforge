# Contexte de build = racine du projet (projects/pdforge) pour pouvoir
# copier à la fois backend/ et shared/. Construire avec :
#   docker build -f backend/Dockerfile -t pdforge-backend .
FROM python:3.12-slim

WORKDIR /srv

# Dépendances système : ocrmypdf nécessite tesseract + ghostscript + qpdf
RUN apt-get update && apt-get install -y --no-install-recommends \
        ocrmypdf \
        tesseract-ocr-fra \
        tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app/
COPY shared ./shared/

ARG APP_COMMIT=""
ENV APP_COMMIT=$APP_COMMIT
ENV PDFORGE_CONTRACT=/srv/shared/server-tools.json

RUN adduser --disabled-password --gecos '' pdfuser
USER pdfuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
