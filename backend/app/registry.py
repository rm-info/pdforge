import json
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from app.tools import ocr

_CONTRACT = Path(__file__).resolve().parents[2] / "shared" / "server-tools.json"
SERVER_TOOL_IDS: set[str] = set(json.loads(_CONTRACT.read_text()))


@dataclass
class ServerTool:
    id: str
    handler: Callable[[list[Path], dict, Path], Path]
    min_files: int
    max_files: int  # 0 = illimité


TOOLS: dict[str, ServerTool] = {
    "ocr": ServerTool(id="ocr", handler=ocr.run, min_files=1, max_files=1),
}


def get_tool(tool_id: str) -> ServerTool | None:
    return TOOLS.get(tool_id)
