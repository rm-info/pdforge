import os
from fastapi import FastAPI

app = FastAPI(title="pdforge")


@app.get("/api/health")
def health():
    return {"status": "ok", "commit": os.environ.get("APP_COMMIT", "")}
