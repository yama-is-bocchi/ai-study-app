import datetime
from typing import Any

from langchain_core.prompts import PromptTemplate

from app.db.model import Question
from util import get_func_name, get_logger

logger = get_logger(__name__)


class PromptGenerator:
    def __init__(self) -> None:
        logger.info("Successful prompt generator")

    def generate_report_prompt_from_history(self, current_date: datetime.datetime) -> str:
        """「回答履歴からレポート作成するプロンプト」を生成する."""
        prompt = PromptTemplate(
            input_variables=["datetime"],
            template="""
# Task
あなたは優秀な学習データアナリストです。
与えらているツールを駆使して、データを分析してください。
そして、苦手分野と考察される問題についてレポートを作成してください。
# Rule
- 下記ツールを確実に利用してください。
    - PostgreSQLツール
    - ファイル読み込みツール
- 現在時刻をもとに最新の回答データを重点的に解析してください。
- memoディレクトリも参照して文脈から苦手分野を考察してください。
- 生成するレポートはより詳しく生成してください。
- ユーザーに対する課題や問題を生成する必要はありません。
- データを分析して苦手分野を特定してください。
---
現在時刻:
{datetime}

""",
        )
        logger.info("Created prompt via: %s()", get_func_name())
        return prompt.format(datetime=current_date)

    def generate_report_prompt_from_field_list(self, field_list: list[str]) -> str:
        """「分野別情報からレポート作成するプロンプト」を生成する."""
        prompt = PromptTemplate(
            input_variables=["field_list"],
            template="""
# Task
あなたは優秀な学習データアナリストです。
与えらているツールを駆使して、データを分析してください。
そして、苦手分野と考察される問題についてレポートを作成してください。
# Rule
- 下記ツールを確実に利用してください。
    - PostgreSQLツール
- 分野別情報から正答率を分析してください。
- 正答率が低いもの、回答数が少ないものを重点的に特定してレポートを作成してください。
---
フィールドリスト:
{field_list}

""",
        )
        logger.info("Created prompt via: %s()", get_func_name())
        return prompt.format(field_list=field_list)

    def generate_question_prompt(self, report: str, field_list: list[str], *questions: Question) -> tuple[PromptTemplate, dict[str, Any]]:
        prompt = PromptTemplate(
            input_variables=["field_list"],
            template="""
# Task
あなたはQuestionジェネレーターです。
レポートの内容を参考にして問題を生成してください。

# Rule
- 最近の問題に含まれる問題と同様の問題は絶対に出題しないでください。
- フィールドリストに含まれる分野のみ出題してください。
- 出題する問題はこのように端的に回答できる問題が望ましいです。
questionの例:
迷惑メール対策として、メール送信に使用される25番ポート（TCP）の通信を遮断する技術とは -> OP25B

---
フィールドリスト:
{field_list}
---
最近の問題:
{questions}
---
レポート:
{report}

""",
        )
        logger.info("Created prompt's template and input via: %s()", get_func_name())
        return (prompt, {"field_list": field_list, "questions": questions, "report": report})
