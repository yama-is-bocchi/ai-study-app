from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.language_models import BaseLanguageModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import BaseTool

from app.lib.logger import get_logger

logger = get_logger(__name__)


class AnalysisAgent:
    def __init__(
        self,
        llm: BaseLanguageModel,
        tool_list: list[BaseTool],
        prompt: ChatPromptTemplate,
    ) -> None:
        base_agent = create_tool_calling_agent(llm, tool_list, prompt)
        self.agent_executor = AgentExecutor(agent=base_agent, tools=tool_list)
        logger.info("Successful create StudyAgent")

    async def chat(
        self,
        prompt: str,
    ) -> str:
        """エージェントにチャットを送信して回答を取得する."""
        response = await self.agent_executor.ainvoke({"input": prompt})
        return response["output"]
