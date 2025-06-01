import asyncio
import datetime
from typing import TYPE_CHECKING
from zoneinfo import ZoneInfo

from util import get_logger

from .config import Config
from .db import PsqlClient
from .db.file.loader import load_field_file
from .lib.prompt import PromptGenerator

if TYPE_CHECKING:
    from .db.model import Question

logger = get_logger(__name__)


class App:
    """DB操作,エージェントを利用したアプリケーションを提供する."""

    def __init__(self, config: Config) -> None:
        # psqlクライアントを追加
        self._analysis_agent = config.analysis_agent
        self._prompt_generator = PromptGenerator()
        self._psql_client = PsqlClient(f"host={config.postgres_host_name} dbname={config.postgres_user} user={config.postgres_user} password={config.postgres_password}")
        self._psql_client.create_tables()
        # 分野別情報を取得してレコードを書き込む
        field_list = load_field_file(config.field_config_file_path)
        self._psql_client.insert_filed_table(field_list)
        # 既に追加されているフィールドも取得できるようにする
        self._field_list = self._psql_client.get_field_list()
        logger.info("Successful create application")

    async def get_analysis_question(self) -> list[dict[str, str]]:
        """回答データを参照して苦手傾向にある問題を生成する."""
        # プロンプトを作成するために回答データをディープリサーチする.
        now = datetime.datetime.now(ZoneInfo("Asia/Tokyo"))
        # 1.最近の回答傾向
        #   - プロンプトを生成
        history_report_prompt = self._prompt_generator.generate_report_prompt_from_history(now)
        #   - エージェントにレポートを作成させる
        # 2.分野別の正答率
        #   - プロンプトを生成
        field_report_prompt = self._prompt_generator.generate_report_prompt_from_field_list(self._field_list)
        #   - エージェントにレポートを作成させる
        logger.info("Requesting an analysis agent to create a report")
        first_report, second_report = await asyncio.gather(
            self._analysis_agent.chat(field_report_prompt),
            self._analysis_agent.chat(history_report_prompt),
        )
        # 3.プロンプトをマージ
        logger.info("Merging reported prompts")
        merged_prompt = self._analysis_agent.merge_report(first_report, second_report)
        # 直前に回答した問題
        recent_questions = self._psql_client.get_answered_data(8)
        logger.info("%d responses were obtained", len(recent_questions))

        # 問題のセットが4つ出来るまで繰り返す
        questions: list[Question] = []
        while len(questions) < 4:
            # 問題生成用のプロンプトを生成
            # 直前に回答した問題,現在生成している問題を付け加える
            question_prompt, question_input = self._prompt_generator.generate_question_prompt(merged_prompt, self._field_list, *recent_questions + questions)
            logger.info("Requesting LLM to generate questions")

            break
        # 回答をJSON形式でパースする
        return [{"prompt": merged_prompt}]

    async def test_chat(self, message: str) -> str:
        return await self._analysis_agent.chat(message)
