import asyncio

from app import App, load_config
from server import Server


def main() -> None:
    # 環境変数をロード
    app_config = load_config()
    app = asyncio.run(App(app_config).init_application())
    server = Server(app)
    server.listen_and_serve(8080)


if __name__ == "__main__":
    main()
