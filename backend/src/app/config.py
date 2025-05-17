import os
from dataclasses import dataclass

SYSTEM_PROMPT_PATH = "data/conf/system_prompt.md"
MCP_CONFIG_FILE_PATH = "data/conf/mcp_config.json"


@dataclass
class Config:
    openai_api_key: str
    openai_model: str
    postgres_user: str
    postgres_password: str
    postgres_host_name: str
    system_prompt_path: str = SYSTEM_PROMPT_PATH
    mcp_config_file_path: str = MCP_CONFIG_FILE_PATH


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
