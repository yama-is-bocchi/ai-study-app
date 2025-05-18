from langchain_openai import ChatOpenAI

from .config import Config
from .db import PsqlClient
from .db.file.loader import load_system_prompt_file
from .lib.agent import AnalysisAgent
from .lib.logger import get_logger
from .lib.tools import get_mcp_tools

logger = get_logger(__name__)


class App:
    """アプリケーションの起動にはinit_applicationの実行が必須です."""

    _analysis_agent: AnalysisAgent

    def __init__(self, config: Config) -> None:
        # psqlクライアントを追加
        self._config = config
        self._psql_client = PsqlClient(f"host={config.postgres_host_name} dbname={config.postgres_user} user={config.postgres_user} password={config.postgres_password}")
        self._psql_client.create_tables()
        logger.info("Successful create application")

    async def init_application(self) -> "App":
        # ツールを取得
        tools = await get_mcp_tools(self._config.mcp_config_file_path)
        # LLMを作成
        llm = ChatOpenAI(
            model=self._config.openai_model,
            temperature=0,
            verbose=True,
        )
        # エージェントを作成
        prompt = load_system_prompt_file(self._config.system_prompt_path)
        self._analysis_agent = AnalysisAgent(llm, tools, prompt)
        logger.info("Successful initialize application")
        return self
