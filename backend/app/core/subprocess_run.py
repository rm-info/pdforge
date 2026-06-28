import subprocess


class ToolError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


def run_cmd(cmd: list[str], timeout: int = 120) -> None:
    try:
        proc = subprocess.run(cmd, capture_output=True, timeout=timeout)
    except subprocess.TimeoutExpired:
        raise ToolError("timeout", "Traitement trop long, interrompu")
    except FileNotFoundError:
        raise ToolError("missing_binary", "Outil de traitement indisponible")
    if proc.returncode != 0:
        raise ToolError("process_failed", "Le traitement a échoué")
