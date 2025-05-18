from langchain_core.prompts import PromptTemplate

from app.lib.logger import get_logger

logger = get_logger(__name__)


class PromptGenerator:
    def __init__(self) -> None:
        logger.info("Successful prompt generator")

    def generate_analysis_question_tuple(self, field_list: list[str]) -> str:
        """app.get_analysis_question向けのプロンプトを返す."""
        template = PromptTemplate(
            input_variables=["field_list"],
            template="""
# Task
あなたは問題ジェネレーターです。
フィールドリストに該当する分野の問題を生成してください。
与えられているツールを利用してユーザーの苦手分野を分析して、出題してください。
また、PostgresSQLサーバーのanswer_tableのレコードから出題する問題が重複しないように気を付けてください。

# Rule
問題は4つ出題してください。
出力形式はこのようにJSON形式で出題してください。
```
[
    {{
        "field":"filed_name",
        "question":"question",
        "answer":"answer"
    }}
]
```
しかし```のようなコードは必要ありません。
全てテキストベースで回答してください。
また、filed_nameはフィールドリスト内にある要素のみ使用してください。
---
フィールドリスト:
{field_list}

""",
        )
        logger.info("Generate analysis question prompt")
        return template.format(field_list=field_list)
