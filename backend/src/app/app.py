from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

from .config import Config, load_system_prompt
from .lib.psql import PsqlClient

SYSTEM_PROMPT_PATH = "data/conf/system_prompt.md"


class App:
    def __init__(self, config: Config) -> None:
        # psqlクライアントを追加
        self._config = config
        self._psql_client = PsqlClient(f"host={config.postgres_host_name} dbname={config.postgres_user} user={config.postgres_user} password={config.postgres_password}")
        self._psql_client.create_tables()

    async def init_langchain_agent(self) -> "App":
        llm = ChatOpenAI(
            model=self._config.openai_model,
            temperature=0,
            verbose=True,
        )
        raw_prompt = load_system_prompt(SYSTEM_PROMPT_PATH)
        prompt = ChatPromptTemplate.from_messages([(raw_prompt), ("{input}"), ("placeholder", "{agent_scratchpad}")])

        return self
