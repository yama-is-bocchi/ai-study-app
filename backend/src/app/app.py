import asyncio
import datetime
import json
from zoneinfo import ZoneInfo

from pydantic import ValidationError

from util import get_logger

from .config import Config
from .db import PsqlClient, StorageClient
from .db.file.loader import load_field_file
from .db.model import FileInfo, GeneratedQuestion, Question
from .lib.prompt import PromptGenerator

logger = get_logger(__name__)


class App:
    """DB操作,エージェントを利用したアプリケーションを提供する."""

    def __init__(self, config: Config) -> None:
        # psqlクライアントを追加
        self._analysis_agent = config.analysis_agent
        self._prompt_generator = PromptGenerator()
        self._psql_client = PsqlClient(f"host={config.postgres_host_name} dbname={config.postgres_user} user={config.postgres_user} password={config.postgres_password}")
        self._storage_client = StorageClient(config.storage_path)
        self._psql_client.create_tables()
        # 分野別情報を取得してレコードを書き込む
        field_list = load_field_file(config.field_config_file_path)
        self._psql_client.insert_field_record(field_list)
        # 既に追加されているフィールドも取得できるようにする
        self._field_list = self._psql_client.get_field_list()
        logger.info("Successful create application")

    async def get_analysis_question(self, question_sum: int = 4) -> list[GeneratedQuestion]:
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
        generated_questions: list[GeneratedQuestion] = []
        while len(generated_questions) < question_sum:
            # 問題生成用のプロンプトを生成
            # 直前に回答した問題,現在生成している問題を付け加える
            question_prompt, question_input = self._prompt_generator.generate_question_prompt(
                merged_prompt,
                self._field_list,
                *recent_questions
                + [
                    Question(
                        field_name=question.field_name,
                        question=question.question,
                        answer=question.answer,
                        correct=False,
                    )
                    for question in generated_questions
                ],
            )
            try:
                # LLMに問題を生成させる
                logger.info("Requesting LLM to generate questions")
                current_question = self._analysis_agent.get_scheme_by_chain(question_prompt, question_input, GeneratedQuestion)
            except ValidationError:
                logger.exception("Failed to get scheme by chain Answers")
            # フィールドリストに含まれているか確認
            if current_question.field_name not in self._field_list:
                logger.info("A field was selected that is not included in the field list : %s , so generation will be retried", current_question.field_name)
                continue
            generated_questions.append(current_question)
            logger.info(
                "successful to generate %d questions.\n question: %s , answer: %s",
                len(generated_questions),
                current_question.question,
                current_question.answer,
            )
        return generated_questions

    def get_random_questions(self, question_sum: int = 4) -> list[GeneratedQuestion]:
        """回答データを参照してランダムに問題を生成する."""
        # 直前に回答した問題
        recent_questions = self._psql_client.get_answered_data(8)
        logger.info("%d responses were obtained", len(recent_questions))

        # 問題のセットが4つ出来るまで繰り返す
        generated_questions: list[GeneratedQuestion] = []
        while len(generated_questions) < question_sum:
            # 問題生成用のプロンプトを生成
            # 直前に回答した問題,現在生成している問題を付け加える
            question_prompt, question_input = self._prompt_generator.generate_question_prompt(
                "",
                self._field_list,
                *recent_questions
                + [
                    Question(
                        field_name=question.field_name,
                        question=question.question,
                        answer=question.answer,
                        correct=False,
                    )
                    for question in generated_questions
                ],
            )
            try:
                # LLMに問題を生成させる
                logger.info("Requesting LLM to generate questions")
                current_question = self._analysis_agent.get_scheme_by_chain(question_prompt, question_input, GeneratedQuestion)
            except ValidationError:
                logger.exception("Failed to get scheme by chain Answers")
            # フィールドリストに含まれているか確認
            if current_question.field_name not in self._field_list:
                logger.info("A field was selected that is not included in the field list : %s , so generation will be retried", current_question.field_name)
                continue
            generated_questions.append(current_question)
            logger.info(
                "successful to generate %d questions.\n question: %s , answer: %s",
                len(generated_questions),
                current_question.question,
                current_question.answer,
            )
        return generated_questions

    def get_incorrect_answers(self, max_limit: int) -> list[Question]:
        """誤答一覧を取得する."""
        logger.info("Getting incorrect answer data...")
        return [question for question in self._psql_client.get_answered_data(max_limit) if not question.correct]

    def register_answer_to_psql(self, raw_data: bytes) -> None:
        """バイト型のデータをパースしてPSQLのレコードに登録する."""
        logger.info("Parsing raw bytes data")
        # パースする
        body_dict = json.loads(raw_data)
        question = Question(**body_dict)
        # 解答履歴データに追加
        self._psql_client.insert_answer_record(question)
        # 正答率を更新
        if question.correct:
            self._psql_client.increment_correct(question.field_name)
            return
        self._psql_client.increment_incorrect(question.field_name)

    def upload_file(self, file_name: str, file_data: bytes) -> None:
        """ファイルデータをストレージに保存する."""
        logger.info("The acquired data is stored in the storage...")
        return self._storage_client.save_file(file_name, file_data)

    def get_all_memo_from_storage(self) -> list[FileInfo]:
        """ストレージに保存されているファイルを全て読み込んで返す."""
        logger.info("Getting all files in storage...")
        return self._storage_client.read_all_markdown_files(365)

    def delete_file_from_storage(self, file_name: str) -> None:
        """ストレージ内のファイルを削除する."""
        logger.info("Deleting %s in the storage...", file_name)
        return self._storage_client.delete_file(file_name)
