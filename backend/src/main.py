import asyncio
import json
from pathlib import Path
from typing import Any

from langchain_mcp_adapters.client import MultiServerMCPClient  # type: ignore

from app import App, load_config
from server import Server


def _load_mcp_config_file(mcp_config_path: str) -> dict[str, Any]:
    """data/mcp/config.jsonからmcpクライアントを返す."""
    path = Path(mcp_config_path)
    with path.open("r", encoding="utf-8") as text:
        return json.load(text)


async def main() -> None:
    params = _load_mcp_config_file("data/conf/mcp_config.json")
    async with MultiServerMCPClient(params["mcpServers"]) as client:
        app_config = await load_config(client)
        app = App(app_config)
        server = Server(app)
        await server.listen_and_serve(8080)


if __name__ == "__main__":
    asyncio.run(main())
