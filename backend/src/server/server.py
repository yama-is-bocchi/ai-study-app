import uvicorn
from fastapi import FastAPI

from app import App, AppContext, get_app_context
from app.lib.logger import get_logger

from .api.router import api_router

logger = get_logger(__name__)


class Server:
    _api_router: FastAPI

    def __init__(self, app: App) -> None:
        # コンテキストを追加
        self.app = app
        self.context = AppContext(app)
        # ルーターを登録
        self._api_router = FastAPI()
        self._api_router.dependency_overrides[get_app_context] = lambda: self.context
        self._api_router.include_router(api_router, prefix="/api/v1")
        logger.info("Successful create server")

    def listen_and_serve(self, port: int) -> None:
        """指定したポート番号でサーバーを起動する."""
        uvicorn.run(self._api_router, host="127.0.0.1", port=port)
