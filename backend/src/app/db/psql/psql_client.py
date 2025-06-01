from psycopg2 import connect
from psycopg2.extras import execute_values

from app.db.model import Question
from util import get_logger

from .queries import CREATE_ANSWER_TABLE, CREATE_FILED_TABLE, INSERT_FIELD_RECORD

logger = get_logger(__name__)


class PsqlClient:
    def __init__(self, connection_str: str) -> None:
        self._connection = connect(connection_str)
        logger.info("Successfully connected to PostgreSQL server.")

    def create_tables(self) -> None:
        """field_table,answer_tableが存在しない場合は作成する."""
        with self._connection.cursor() as cursor:
            # 外部キー制約により、順番は変えてはいけない
            # CREATE_FILED_TABLE -> CREATE_ANSWER_TABLE
            cursor.execute(CREATE_FILED_TABLE)
            cursor.execute(CREATE_ANSWER_TABLE)
        self._connection.commit()
        logger.info("Successfully created tables and committed.")

    def insert_filed_table(self, field_list: list[str]) -> None:
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

    def get_field_list(self) -> list[str]:
        """field_tableに登録されいてるレコード情報を全て取得する."""
        with self._connection.cursor() as cursor:
            cursor.execute("SELECT name FROM field_table")
            rows = cursor.fetchall()
            logger.info("Successful get field list")
            return [row[0] for row in rows]

    def get_answered_data(self, recent_count: int = 4) -> list[Question]:
        """idの降順で直近の回答データを取得する."""
        with self._connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT filed_name, question, answer, correct, timestamp
                FROM answer_table
                ORDER BY id DESC
                LIMIT %s
            """,
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
