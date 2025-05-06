from psycopg2 import connect

from .queries import CREATE_ANSWER_TABLE, CREATE_FILED_TABLE


class PsqlClient:
    def __init__(self, connection_str: str) -> None:
        self._connection = connect(connection_str)

    def create_tables(self) -> None:
        """必要なテーブルが存在しない場合は作成する."""
        with self._connection.cursor() as cursor:
            # 外部キー制約により、順番は変えてはいけない
            # CREATE_FILED_TABLE -> CREATE_ANSWER_TABLE
            cursor.execute(CREATE_FILED_TABLE)
            cursor.execute(CREATE_ANSWER_TABLE)
        self._connection.commit()
