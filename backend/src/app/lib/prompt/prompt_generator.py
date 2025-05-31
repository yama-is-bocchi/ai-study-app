from langchain_core.prompts import PromptTemplate

from app.lib.logger import get_logger

logger = get_logger(__name__)


class PromptGenerator:
    def __init__(self) -> None:
        logger.info("Successful prompt generator")

    def generate_analysis_question_prompt(self, field_list: list[str]) -> str:
        """app.get_analysis_question向けのプロンプトを返す."""
        prompt = PromptTemplate(
            input_variables=["field_list"],
            template="""
# Task
あなたは問題ジェネレーターです。
フィールドリストに該当する分野の問題を生成してください。
# Rule
- 与えられているツールを駆使してユーザーの苦手分野を分析して出題してください。
- PostgreSQLサーバーのanswer_tableのレコードから出題する問題文が重複しないように気を付けてください。
- また、filed_nameはフィールドリスト内にある要素のみ使用してください。
---
フィールドリスト:
{field_list}

""",
        )
        logger.info("Generated analysis question prompt")
        return prompt.format(field_list=field_list)
