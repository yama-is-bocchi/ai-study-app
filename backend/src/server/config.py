import os
from dataclasses import dataclass


@dataclass
class Config:
    port: int
    cors_allow_origin: str | None


def load_config() -> Config:
    cors_allow_origin = os.getenv("CORS_ALLOW_ORIGIN")
    port = os.getenv("PORT")
    return Config(
        port=int(port) if port else 8080,
        cors_allow_origin=str(cors_allow_origin) if cors_allow_origin else None,
    )
