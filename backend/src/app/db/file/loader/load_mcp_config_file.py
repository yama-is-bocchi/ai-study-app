import json
from pathlib import Path
from typing import Any


def load_mcp_config_file(mcp_config_path: str) -> dict[str, Any]:
    """data/mcp/config.jsonからmcpクライアントを返す."""
    path = Path(mcp_config_path)
    with path.open("r", encoding="utf-8") as text:
        return json.load(text)
