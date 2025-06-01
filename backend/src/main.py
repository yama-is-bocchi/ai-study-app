import asyncio

from app import App, ConfigLoader
from server import Server


async def main() -> None:
    async with ConfigLoader() as config:
        app = App(config)
        server = Server(app)
        await server.listen_and_serve(8080)


if __name__ == "__main__":
    asyncio.run(main())
