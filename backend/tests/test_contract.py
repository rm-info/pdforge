import json
from pathlib import Path
from app.registry import TOOLS, SERVER_TOOL_IDS

CONTRACT = Path(__file__).resolve().parents[2] / "shared" / "server-tools.json"


def test_registry_matches_contract():
    declared = set(json.loads(CONTRACT.read_text()))
    assert set(TOOLS.keys()) == declared
    assert SERVER_TOOL_IDS == declared
