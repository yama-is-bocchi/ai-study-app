from fastapi import FastAPI

from app import App
from app.lib.logger import get_logger

from .lib.router import api_router

logger = get_logger(__name__)


class Server:
    api_router: FastAPI

    def __init__(self, app: App) -> None:
        self.app = app
        self.api_router = FastAPI()
        self.api_router.include_router(api_router, prefix="/api/v1")
        logger.info("Successful create server")
