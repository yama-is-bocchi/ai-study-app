from langchain_mcp_adapters.client import MultiServerMCPClient  # type: ignore

from app import App, load_config, load_mcp_config_file
from server import Server


async def run() -> None:
    params = load_mcp_config_file("data/conf/mcp_config.json")
    async with MultiServerMCPClient(params["mcpServers"]) as client:
        app_config = await load_config(client)
        app = App(app_config)
        server = Server(app)
        await server.listen_and_serve(8080)
