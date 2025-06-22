import asyncio

from app import App, ConfigLoader
from server import Server, load_config


async def main() -> None:
    async with ConfigLoader() as config:
        app = App(config)
        server_config = load_config()
        server = Server(app, server_config)
        await server.listen_and_serve()


if __name__ == "__main__":
    asyncio.run(main())
