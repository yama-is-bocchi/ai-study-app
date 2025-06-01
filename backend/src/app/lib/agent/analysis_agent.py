from typing import TypeVar, cast

from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.language_models import BaseLanguageModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import BaseTool
from pydantic import BaseModel

from util import get_logger

T = TypeVar("T", bound=BaseModel)

logger = get_logger(__name__)


class AnalysisAgent:
    def __init__(
        self,
        llm: BaseLanguageModel,
        tool_list: list[BaseTool],
        prompt: ChatPromptTemplate,
    ) -> None:
        self._llm = llm
        base_agent = create_tool_calling_agent(llm, tool_list, prompt)
        self._agent_executor = AgentExecutor(agent=base_agent, tools=tool_list)
        logger.info("Successful create StudyAgent")

    async def chat(
        self,
        prompt: str,
    ) -> str:
        """エージェントにチャットを送信して回答を取得する."""
        response = await self._agent_executor.ainvoke({"input": prompt})
        return response["output"]

    async def get_scheme_by_chat(
        self,
        prompt: str,
        schema: type[T],
    ) -> T:
        """LLMに型引数のスキーマを指定してレスポンスを取得する."""
        # self._llmを利用する
        return cast("T", "")
