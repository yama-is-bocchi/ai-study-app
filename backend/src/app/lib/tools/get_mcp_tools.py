from langchain_core.tools import BaseTool
from langchain_mcp_adapters.client import MultiServerMCPClient  # type: ignore

from app.db.file.loader import load_mcp_config_file


async def get_mcp_tools(mcp_config_path: str) -> list[BaseTool]:
    """mcpアダプタからツールを取得する."""
    params = load_mcp_config_file(mcp_config_path)
    async with MultiServerMCPClient(params["mcpServers"]) as client:
        return client.get_tools()
