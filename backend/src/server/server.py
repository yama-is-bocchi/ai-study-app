from pathlib import Path

import uvicorn
from fastapi import FastAPI, HTTPException, Request
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
            self._api_router.mount("/assets", StaticFiles(directory=frontend_dist / "assets"), name="assets")

        @self._api_router.get("/{full_path:path}")
        async def spa_fallback(full_path: str, request: Request) -> FileResponse:
            if full_path.startswith(("api/", "assets/")):
                raise HTTPException(status_code=404)
            index_path = frontend_dist / "index.html"
            if not index_path.exists():
                raise HTTPException(status_code=500, detail="index.html not found")
            return FileResponse(index_path)

    async def listen_and_serve(self) -> None:
        """サーバーを起動する."""
        if self.config.cors_allow_origin:
            self._api_router.add_middleware(CORSMiddleware, allow_origins=self.config.cors_allow_origin)
        config = uvicorn.Config(self._api_router, host="0.0.0.0", port=self.config.port, loop="asyncio")  # noqa: S104
        server = uvicorn.Server(config)
        await server.serve()
