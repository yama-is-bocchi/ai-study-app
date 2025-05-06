import os
from dataclasses import dataclass

from dotenv import load_dotenv


@dataclass
class Config:
    openai_api_key: str
    openai_model: str
    postgres_user: str
    postgres_password: str
    postgres_host_name: str


def load_config(dotenv_path: str) -> Config:
    """環境変数をロードしてConfigを返す."""
    load_dotenv(dotenv_path)
    openai_api_key = os.getenv("OPENAI_API_KEY")
    openai_model = os.getenv("OPENAI_MODEL")
    postgres_user = os.getenv("POSTGRES_USER")
    postgres_password = os.getenv("POSTGRES_PASSWORD")
    postgres_host_name = os.getenv("POSTGRES_HOST_NAME")
    if {
        openai_api_key,
        openai_model,
        postgres_user,
        postgres_password,
        postgres_host_name,
        postgres_host_name,
    } & {"", None}:
        message = "必要な環境変数がセットされていません。"
        raise Exception(message)

    return Config(
        openai_api_key=str(openai_api_key),
        openai_model=str(openai_model),
        postgres_user=str(postgres_user),
        postgres_password=str(postgres_password),
        postgres_host_name=str(postgres_host_name),
    )
