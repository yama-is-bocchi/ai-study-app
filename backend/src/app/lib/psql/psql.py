from typing import Any

from psycopg2 import connect


class PsqlClient:
    _connection: Any

    def __init__(self, connection_str: str) -> None:
        self._connection = connect(connection_str)
