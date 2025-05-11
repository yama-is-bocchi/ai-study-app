import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass
class Config:
    openai_api_key: str
    openai_model: str
    postgres_user: str
    postgres_password: str
    postgres_host_name: str


def load_config() -> Config:
    """環境変数をロードしてConfigを返す."""
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


def load_system_prompt(system_prompt_path: str) -> str:
    """プロンプト設定ファイルを読み込む."""
    data_dir = Path(system_prompt_path)
    return data_dir.read_text()


def load_mcp_client_params(mcp_config_path: str) -> Any:
    """data/mcp/config.jsonからmcpクライアントを返す."""
    path = Path(mcp_config_path)
    with path.open("r", encoding="utf-8") as text:
        return json.load(text)
