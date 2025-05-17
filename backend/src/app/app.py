from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_mcp_adapters.client import MultiServerMCPClient  # type: ignore
from langchain_openai import ChatOpenAI

from .config import Config, load_mcp_client_params, load_system_prompt
from .lib.logger import get_logger
from .lib.psql import PsqlClient

logger = get_logger(__name__)


class App:
    _agent_executor: AgentExecutor

    def __init__(self, config: Config) -> None:
        # psqlクライアントを追加
        self._config = config
        self._psql_client = PsqlClient(f"host={config.postgres_host_name} dbname={config.postgres_user} user={config.postgres_user} password={config.postgres_password}")
        self._psql_client.create_tables()
        logger.info("Successful create application")

    async def init_langchain_agent(self) -> "App":
        params = load_mcp_client_params(self._config.mcp_config_file_path)
        async with MultiServerMCPClient(params["mcpServers"]) as client:
            # プロンプトを設定
            raw_prompt = load_system_prompt(self._config.system_prompt_path)
            prompt = ChatPromptTemplate.from_messages([(raw_prompt), ("{input}"), ("placeholder", "{agent_scratchpad}")])

            # LLMを登録
            llm = ChatOpenAI(
                model=self._config.openai_model,
                temperature=0,
                verbose=True,
            )
            # エージェントを登録
            tools = client.get_tools()
            agent = create_tool_calling_agent(llm, tools, prompt)
            self._agent_executor = AgentExecutor(agent=agent, tools=tools)
            logger.info("Successful initialize application")
            return self
