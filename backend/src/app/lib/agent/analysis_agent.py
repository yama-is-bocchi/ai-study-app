from typing import Any, TypeVar, cast

from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.language_models import BaseChatModel
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.tools import BaseTool
from pydantic import BaseModel

from util import get_func_name, get_logger

T = TypeVar("T", bound=BaseModel)

logger = get_logger(__name__)


class AnalysisAgent:
    def __init__(
        self,
        llm: BaseChatModel,
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
        logger.info("Completed agent invoke via: %s", get_func_name())
        return response["output"]

    def merge_report(self, first_report: str, second_report: str) -> str:
        """二つのレポートをマージする."""
        prompt = PromptTemplate(
            input_variables=["text1", "text2"],
            template="""
# Task
あなたは優秀なレポートマージャーです。
与えらている2つのレポートの内容を詳細な1つのレポートにマージしてください。

# Rule
- ハルシネーションを起こさないこと。
- 文章に具体的な手順や詳細な情報が含まれている場合、それらは省略や要約せず、できる限りそのまま使用すること。
- 情報量は多ければ多いほどよい。
- 図や具体的な数値がレポートに含まれていたら、表示してください。

---
レポート1:
{text1}

---
レポート2:
{text2}
""",
        )
        response = (prompt | self._llm).invoke({"text1": first_report, "text2": second_report})
        logger.info("Completed merging report")
        return response.text()

    def get_scheme_by_chain(
        self,
        prompt: PromptTemplate,
        prompt_input: dict[str, Any],
        schema: type[T],
    ) -> T:
        """LLMに型引数のスキーマを指定してレスポンスを取得する."""
        # self._llmを利用する
        response = (prompt | self._llm.with_structured_output(schema=schema, strict=True)).invoke(prompt_input)
        logger.info("Completed agent invoke with structured output")
        return cast("T", response)
