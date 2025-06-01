import datetime

from langchain_core.prompts import PromptTemplate

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
            input_variables=["datetime"],
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
