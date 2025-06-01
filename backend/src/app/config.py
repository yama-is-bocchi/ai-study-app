import os
import types
from dataclasses import dataclass

from langchain_mcp_adapters.client import MultiServerMCPClient  # type: ignore
from langchain_openai import ChatOpenAI

from .db.file.loader import load_mcp_file, load_system_prompt_file
from .lib.agent import AnalysisAgent

SYSTEM_PROMPT_PATH = "data/conf/system_prompt.md"
FIELD_FILE_PATH = "data/conf/.fields"
MCP_CONFIG_FILE_PATH = "data/conf/mcp_config.json"


@dataclass
class Config:
    openai_api_key: str
    postgres_user: str
    postgres_password: str
    postgres_host_name: str
    analysis_agent: AnalysisAgent
    field_config_file_path: str = FIELD_FILE_PATH


class ConfigLoader:
    _mcp_client: MultiServerMCPClient | None = None

    async def __aenter__(self) -> Config:
        params = load_mcp_file(MCP_CONFIG_FILE_PATH)
        self._mcp_client = MultiServerMCPClient(params["mcpServers"])
        await self._mcp_client.__aenter__()

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
            msg = "必要な環境変数がセットされていません。"
            raise Exception(msg)

        tools = self._mcp_client.get_tools()
        llm = ChatOpenAI(model=str(openai_model), temperature=0, verbose=True)
        prompt = load_system_prompt_file(SYSTEM_PROMPT_PATH)
        analysis_agent = AnalysisAgent(llm, tools, prompt)

        self.config = Config(
            openai_api_key=str(openai_api_key),
            postgres_user=str(postgres_user),
            postgres_password=str(postgres_password),
            postgres_host_name=str(postgres_host_name),
            analysis_agent=analysis_agent,
        )
        return self.config

    async def __aexit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: types.TracebackType | None,
    ) -> None:
        if self._mcp_client:
            await self._mcp_client.__aexit__(exc_type, exc, tb)
