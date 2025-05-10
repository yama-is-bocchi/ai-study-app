from psycopg2 import connect

from app.lib.logger import get_logger

from .queries import CREATE_ANSWER_TABLE, CREATE_FILED_TABLE

logger = get_logger(__name__)


class PsqlClient:
    def __init__(self, connection_str: str) -> None:
        self._connection = connect(connection_str)
        logger.info("Successfully connected to PostgreSQL server.")

    def create_tables(self) -> None:
        """必要なテーブルが存在しない場合は作成する."""
        with self._connection.cursor() as cursor:
            # 外部キー制約により、順番は変えてはいけない
            # CREATE_FILED_TABLE -> CREATE_ANSWER_TABLE
            cursor.execute(CREATE_FILED_TABLE)
            cursor.execute(CREATE_ANSWER_TABLE)
        self._connection.commit()
        logger.info("Successfully created tables and committed.")
