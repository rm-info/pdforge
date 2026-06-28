import json
import os

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware

from app.registry import get_tool, SERVER_TOOL_IDS
from app.core.tempfiles import temp_workdir
from app.core.validation import validate_pdf, ValidationError
from app.core.subprocess_run import ToolError

app = FastAPI(title="pdforge")

ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "https://pdforge.lab.rm-info.fr")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def _err(status: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(status_code=status, content={"code": code, "message": message})


@app.get("/api/health")
def health():
    return {"status": "ok", "commit": os.environ.get("APP_COMMIT", "")}


@app.get("/api/tools")
def list_tools():
    return {"server_tools": sorted(SERVER_TOOL_IDS)}


@app.post("/api/tools/{tool_id}")
async def run_tool(
    tool_id: str,
    files: list[UploadFile] = File(...),
    params: str = Form("{}"),
):
    tool = get_tool(tool_id)
    if tool is None:
        raise HTTPException(status_code=404, detail="Outil inconnu")

    if len(files) < tool.min_files or (tool.max_files and len(files) > tool.max_files):
        return _err(400, "bad_count", "Nombre de fichiers invalide")

    try:
        parsed = json.loads(params)
    except json.JSONDecodeError:
        return _err(400, "bad_params", "Paramètres invalides")

    out_bytes: bytes | None = None
    with temp_workdir() as wd:
        input_paths = []
        for i, f in enumerate(files):
            data = await f.read()
            try:
                validate_pdf(data)
            except ValidationError as e:
                return _err(400, e.code, e.message)
            p = wd / f"in_{i}.pdf"
            p.write_bytes(data)
            input_paths.append(p)
        try:
            out = tool.handler(input_paths, parsed, wd)
            out_bytes = out.read_bytes()
        except ValidationError as e:
            return _err(400, e.code, e.message)
        except ToolError as e:
            return _err(500, e.code, e.message)
    # temp supprimé ici ; octets déjà en mémoire -> streaming sûr
    return Response(
        content=out_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{tool_id}.pdf"'},
    )
