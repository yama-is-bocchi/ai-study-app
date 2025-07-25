from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app import App, AppContext, get_app_context
from util import get_logger

from .api.router import question_api_router, storage_api_router
from .config import Config

logger = get_logger(__name__)


class Server:
    _api_router: FastAPI

    def __init__(self, app: App, config: Config) -> None:
        # コンテキストを追加
        self.app = app
        self.config = config
        self.context = AppContext(app)
        # ルーターを登録
        self._api_router = FastAPI()
        self._api_router.dependency_overrides[get_app_context] = lambda: self.context
        self._api_router.include_router(question_api_router, prefix="/api/v1/question")
        self._api_router.include_router(storage_api_router, prefix="/api/v1/files")
        logger.info("Successful create server")

        # UIを配信
        frontend_dist = Path(config.react_static_content_path)
        if frontend_dist.exists():
            self._api_router.mount("/ui", StaticFiles(directory=frontend_dist, html=True))

            @self._api_router.get("/ui/{full_path:path}")
            async def react_router_fallback(full_path: str) -> FileResponse:
                index_file = frontend_dist / "index.html"
                return FileResponse(index_file)

    async def listen_and_serve(self) -> None:
        """サーバーを起動する."""
        if self.config.cors_allow_origin:
            self._api_router.add_middleware(CORSMiddleware, allow_origins=self.config.cors_allow_origin)
        config = uvicorn.Config(self._api_router, port=self.config.port, loop="asyncio")
        server = uvicorn.Server(config)
        await server.serve()
