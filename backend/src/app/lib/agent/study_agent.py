from pathlib import Path

from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.language_models import BaseLanguageModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import BaseTool

from app.lib.logger import get_logger

logger = get_logger(__name__)


class StudyAgent:
    def __init__(
        self,
        llm: BaseLanguageModel,
        tool_list: list[BaseTool],
        system_prompt_file_path: str,
    ) -> None:
        # プロンプトを取得
        raw_prompt = self._load_system_prompt(system_prompt_file_path)
        prompt = ChatPromptTemplate.from_messages([(raw_prompt), ("{input}"), ("placeholder", "{agent_scratchpad}")])
        # エージェント作成
        base_agent = create_tool_calling_agent(llm, tool_list, prompt)
        self.agent_executor = AgentExecutor(agent=base_agent, tools=tool_list)
        logger.info("Successful create StudyAgent")

    def _load_system_prompt(self, system_prompt_path: str) -> str:
        """プロンプト設定ファイルを読み込む."""
        data_dir = Path(system_prompt_path)
        return data_dir.read_text()
