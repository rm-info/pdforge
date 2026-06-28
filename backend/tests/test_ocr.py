import pytest
from app.core.subprocess_run import run_cmd, ToolError


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
