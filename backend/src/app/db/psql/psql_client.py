from psycopg2 import connect
from psycopg2.extras import execute_values

from app.db.model import Question
from util import get_logger

from .queries import (
    CREATE_ANSWER_TABLE,
    CREATE_FIELD_TABLE,
    INCREMENT_FIELDS_CORRECT,
    INCREMENT_FIELDS_INCORRECT,
    INSERT_ANSWER_RECORD,
    INSERT_FIELD_RECORD,
    SELECT_ANSWER_TABLE_BY_LIMIT,
    SELECT_NAME_FROM_FIELD_TABLE,
)

logger = get_logger(__name__)


class PsqlClient:
    def __init__(self, connection_str: str) -> None:
        self._connection = connect(connection_str)
        logger.info("Successfully connected to PostgreSQL server.")

    def create_tables(self) -> None:
        """field_table,answer_tableが存在しない場合は作成する."""
        with self._connection.cursor() as cursor:
            # 外部キー制約により、順番は変えてはいけない
            # CREATE_FIELD_TABLE -> CREATE_ANSWER_TABLE
            cursor.execute(CREATE_FIELD_TABLE)
            cursor.execute(CREATE_ANSWER_TABLE)
        self._connection.commit()
        logger.info("Successfully created tables and committed.")

    def insert_field_record(self, field_list: list[str]) -> None:
        """引数のリストをfield_tableのレコードに追加する."""
        # リストが空なら早期リターン
        if not field_list:
            logger.info("Not found field list.")
            return
        # 初期値0でタプルを作成
        values = [(name, 0, 0, 0.0) for name in field_list]
        with self._connection.cursor() as cursor:
            execute_values(cursor, INSERT_FIELD_RECORD, values)
            self._connection.commit()
            logger.info("Inserted %d new records into field_table.", cursor.rowcount)

    def insert_answer_record(self, question: Question) -> None:
        """引数のリストをanswer_tableのレコードに追加する."""
        with self._connection.cursor() as cursor:
            values = [
                (
                    question.field_name,
                    question.question,
                    question.answer,
                    question.correct,
                ),
            ]
            execute_values(cursor, INSERT_ANSWER_RECORD, values)
            self._connection.commit()
            logger.info("Inserted %d new records into answer_table.", cursor.rowcount)

    def get_field_list(self) -> list[str]:
        """field_tableに登録されいてるレコード情報を全て取得する."""
        with self._connection.cursor() as cursor:
            cursor.execute(SELECT_NAME_FROM_FIELD_TABLE)
            rows = cursor.fetchall()
            logger.info("Successful get field list")
            return [row[0] for row in rows]

    def get_answered_data(self, recent_count: int = 4) -> list[Question]:
        """idの降順で直近の回答データを取得する."""
        with self._connection.cursor() as cursor:
            cursor.execute(
                SELECT_ANSWER_TABLE_BY_LIMIT,
                (recent_count,),
            )
            rows = cursor.fetchall()
        logger.info("Successful get question list")
        return [
            Question(
                field_name=row[0],
                question=row[1],
                answer=row[2],
                correct=row[3],
                timestamp=row[4],
            )
            for row in rows
        ]

    def increment_correct(self, field_name: str) -> None:
        """対象の分野名の正答数をインクリメントして正答率を更新する."""
        with self._connection.cursor() as cursor:
            cursor.execute(INCREMENT_FIELDS_CORRECT, (field_name,))
            self._connection.commit()
            logger.info("The number of correct answers for %s records has been incremented and updated.", cursor.rowcount)

    def increment_incorrect(self, field_name: str) -> None:
        """対象の分野名の誤答数をインクリメントして正答率を更新する."""
        with self._connection.cursor() as cursor:
            cursor.execute(INCREMENT_FIELDS_INCORRECT, (field_name,))
            self._connection.commit()
            logger.info("The number of incorrect answers for %s records has been incremented and updated.", cursor.rowcount)
