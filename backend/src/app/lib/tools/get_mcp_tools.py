import json
from pathlib import Path
from typing import Any

from langchain_core.tools import BaseTool
from langchain_mcp_adapters.client import MultiServerMCPClient  # type: ignore


async def get_mcp_tools(mcp_config_path: str) -> list[BaseTool]:
    """mcpアダプタからツールを取得する."""
    params = load_mcp_client_params(mcp_config_path)
    async with MultiServerMCPClient(params["mcpServers"]) as client:
        return client.get_tools()


def load_mcp_client_params(mcp_config_path: str) -> dict[str, Any]:
    """data/mcp/config.jsonからmcpクライアントを返す."""
    path = Path(mcp_config_path)
    with path.open("r", encoding="utf-8") as text:
        return json.load(text)
