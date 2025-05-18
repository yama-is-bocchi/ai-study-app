import asyncio

from app import App, load_config
from server import Server


def main() -> None:
    # 環境変数をロード
    app_config = asyncio.run(load_config())
    app = App(app_config)
    server = Server(app)
    server.listen_and_serve(8080)


if __name__ == "__main__":
    main()
