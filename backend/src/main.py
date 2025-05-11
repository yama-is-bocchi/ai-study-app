import asyncio

import uvicorn

from app import App, load_config
from server import Server


def main() -> None:
    # 環境変数をロード
    app_config = load_config()
    app = asyncio.run(App(app_config).init_langchain_agent())
    server = Server(app)
    uvicorn.run(server.api_router, host="127.0.0.1", port=8080)


if __name__ == "__main__":
    main()
