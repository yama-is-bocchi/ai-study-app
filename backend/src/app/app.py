import asyncio
import datetime
import json
from typing import Any, TypeVar
from zoneinfo import ZoneInfo

from pydantic import BaseModel, ValidationError

from util import get_logger

from .config import Config
from .db import PsqlClient, StorageClient
from .db.file.loader import load_field_file
from .db.model import DummyAnswers, FileInfo, GeneratedQuestion, Question, ReportCache
from .lib.prompt import PromptGenerator

logger = get_logger(__name__)
T = TypeVar("T", bound=BaseModel)

# TODO: 引数をinterfaceにする


class App:
    """DB操作,エージェントを利用したアプリケーションを提供する."""

    _cache_limit = 15
    _oldest_question_limit = 8

    def __init__(self, config: Config) -> None:
        # psqlクライアントを追加
        self._analysis_agent = config.analysis_agent
        self._prompt_generator = PromptGenerator()
        self._psql_client = PsqlClient(f"host={config.postgres_host_name} dbname={config.postgres_user} user={config.postgres_user} password={config.postgres_password}")
        self._storage_client = StorageClient(config.storage_path)
        self._report_cache_file_name = config.storage_reports_cache_file_name
        self._psql_client.create_tables()
        # 分野別情報を取得してレコードを書き込む
        field_list = load_field_file(config.field_config_file_path)
        self._psql_client.insert_field_record(field_list)
        # 既に追加されているフィールドも取得できるようにする
        self._field_list = self._psql_client.get_field_list()
        logger.info("Successful create application")

    async def get_analysis_question(self, question_sum: int = 4) -> dict[str, Any]:
        """回答データを参照して苦手傾向にある問題を生成する."""
        # プロンプトを作成するために回答データをディープリサーチする.
        now = datetime.datetime.now(ZoneInfo("Asia/Tokyo"))
        report = self._storage_client.read_json_file(self._report_cache_file_name, ReportCache)
        current_answer_sum = self._psql_client.get_answered_sum()
        if self._psql_client.get_answered_sum() - report.answer_count > self._cache_limit:
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
            report = ReportCache(answer_count=current_answer_sum, report=merged_prompt)
            self._storage_client.save_file(self._report_cache_file_name, report.model_dump_json().encode("utf-8"))
        # 直前に回答した問題
        recent_questions = self._psql_client.get_answered_data(self._oldest_question_limit)
        logger.info("%d responses were obtained", len(recent_questions))

        question_prompt, question_input = self._prompt_generator.generate_question_prompt(
            report.report,
            self._field_list,
            *recent_questions,
        )
        try:
            # LLMに問題を生成させる
            logger.info("Requesting LLM to generate questions")
            target_question = self._analysis_agent.get_scheme_by_chain(question_prompt, question_input, GeneratedQuestion)
            logger.info("Generated question. question: %s, answer: %s", target_question.question, target_question.answer)

            dummy_question_prompt, dummy_question_input = self._prompt_generator.generate_dummy_answer_prompt(target_question, question_sum - 1)
            while True:
                logger.info("Requesting LLM to dummy answers")
                dummy_answers = self._analysis_agent.get_scheme_by_chain(dummy_question_prompt, dummy_question_input, DummyAnswers)
                if len(dummy_answers.dummy_answers) >= question_sum - 1:
                    logger.info("Generated dummy answers: %s", dummy_answers.dummy_answers[: question_sum - 1])
                    break
                logger.info("Invalid dummy answer was printed: %s", dummy_answers.dummy_answers)
        except ValidationError:
            logger.exception("Failed to get scheme by chain Answers")

        return {"question": target_question, "dummy_answers": dummy_answers.dummy_answers[: question_sum - 1]}

    def get_random_questions(self, question_sum: int = 4) -> dict[str, Any]:
        """回答データを参照してランダムに問題を生成する."""
        # 直前に回答した問題
        recent_questions = self._psql_client.get_answered_data(self._oldest_question_limit)
        logger.info("%d responses were obtained", len(recent_questions))

        question_prompt, question_input = self._prompt_generator.generate_question_prompt(
            "",
            self._field_list,
            *recent_questions,
        )
        try:
            # LLMに問題を生成させる
            logger.info("Requesting LLM to generate questions")
            target_question = self._analysis_agent.get_scheme_by_chain(question_prompt, question_input, GeneratedQuestion)
            logger.info("Generated question. question: %s, answer: %s", target_question.question, target_question.answer)

            dummy_question_prompt, dummy_question_input = self._prompt_generator.generate_dummy_answer_prompt(target_question, question_sum - 1)
            while True:
                logger.info("Requesting LLM to dummy answers")
                dummy_answers = self._analysis_agent.get_scheme_by_chain(dummy_question_prompt, dummy_question_input, DummyAnswers)
                if len(dummy_answers.dummy_answers) >= question_sum - 1:
                    logger.info("Generated dummy answers: %s", dummy_answers.dummy_answers[: question_sum - 1])
                    break
                logger.info("Invalid dummy answer was printed: %s", dummy_answers.dummy_answers)
        except ValidationError:
            logger.exception("Failed to get scheme by chain Answers")

        return {"question": target_question, "dummy_answers": dummy_answers.dummy_answers[: question_sum - 1]}

    def get_incorrect_answers(self, max_limit: int) -> list[Question]:
        """誤答一覧を取得する."""
        logger.info("Getting incorrect answer data...")
        return [question for question in self._psql_client.get_answered_data(max_limit) if not question.correct]

    def register_answer_to_psql(self, raw_data: bytes) -> None:
        """バイト型のデータをパースしてPSQLのレコードに登録する."""
        question = self._get_schema_from_bytes(Question, raw_data)
        # 解答履歴データに追加
        self._psql_client.insert_answer_record(question)
        # 正答率を更新
        if question.correct:
            self._psql_client.increment_correct(question.field_name)
            return
        self._psql_client.increment_incorrect(question.field_name)

    async def get_commentary_from_question(self, raw_data: bytes) -> str:
        """問題文と回答から解説を取得する."""
        question = self._get_schema_from_bytes(GeneratedQuestion, raw_data)
        prompt = self._prompt_generator.generate_commentary_prompt(question)
        return await self._analysis_agent.chat(prompt)

    def upload_file(self, file_name: str, file_data: bytes) -> None:
        """ファイルデータをストレージに保存する."""
        logger.info("The acquired data is stored in the storage...")
        return self._storage_client.save_file(file_name, file_data)

    def get_all_memo_from_storage(self, limit: int) -> list[FileInfo]:
        """ストレージに保存されているファイルを全て読み込んで返す."""
        logger.info("Getting all files in storage...")
        return self._storage_client.read_all_markdown_files(limit)

    def delete_file_from_storage(self, file_name: str) -> None:
        """ストレージ内のファイルを削除する."""
        logger.info("Deleting %s in the storage...", file_name)
        return self._storage_client.delete_file(file_name)

    def _get_schema_from_bytes(self, schema: type[T], raw_data: bytes) -> T:
        """バイト列から引数のスキーマのデータを取得する."""
        logger.info("Parsing raw bytes data")
        # パースする
        body_dict = json.loads(raw_data)
        return schema(**body_dict)
