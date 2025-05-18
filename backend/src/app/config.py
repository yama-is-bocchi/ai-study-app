import os
from dataclasses import dataclass

from langchain_mcp_adapters.client import MultiServerMCPClient  # type: ignore
from langchain_openai import ChatOpenAI

from .db.file.loader import load_system_prompt_file
from .lib.agent import AnalysisAgent

SYSTEM_PROMPT_PATH = "data/conf/system_prompt.md"
FIELD_FILE_PATH = "data/conf/.fields"


@dataclass
class Config:
    openai_api_key: str
    postgres_user: str
    postgres_password: str
    postgres_host_name: str
    analysis_agent: AnalysisAgent
    field_config_file_path: str = FIELD_FILE_PATH


async def load_config(mcp_client: MultiServerMCPClient) -> Config:
    """環境変数をロードしてConfigを返す."""
    openai_api_key = os.getenv("OPENAI_API_KEY")
    openai_model = os.getenv("OPENAI_MODEL")
    postgres_user = os.getenv("POSTGRES_USER")
    postgres_password = os.getenv("POSTGRES_PASSWORD")
    postgres_user = os.getenv("POSTGRES_USER")
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
    tools = mcp_client.get_tools()
    # LLMを作成
    llm = ChatOpenAI(
        model=str(openai_model),
        temperature=0,
        verbose=True,
    )
    # エージェントを作成
    prompt = load_system_prompt_file(SYSTEM_PROMPT_PATH)
    analysis_agent = AnalysisAgent(llm, tools, prompt)
    return Config(
        openai_api_key=str(openai_api_key),
        postgres_user=str(postgres_user),
        postgres_password=str(postgres_password),
        postgres_host_name=str(postgres_host_name),
        analysis_agent=analysis_agent,
    )
