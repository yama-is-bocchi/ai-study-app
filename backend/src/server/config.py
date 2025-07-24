import os
from dataclasses import dataclass


@dataclass
class Config:
    port: int
    react_static_content_path: str
    cors_allow_origin: str | None


def load_config() -> Config:
    cors_allow_origin = os.getenv("CORS_ALLOW_ORIGIN")
    react_static_content_path = os.getenv("REACT_STATIC_CONTENT_PATH", "dist")
    port = os.getenv("PORT")
    return Config(
        port=int(port) if port else 8080,
        react_static_content_path=str(react_static_content_path),
        cors_allow_origin=str(cors_allow_origin) if cors_allow_origin else None,
    )
