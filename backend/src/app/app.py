from .config import Config
from .lib.psql import PsqlClient


class App:
    _psql_client: PsqlClient

    def __init__(self, config: Config) -> None:
        self._psql_client = PsqlClient(f"host={config.postgres_host_name} dbname={config.postgres_user} user={config.postgres_user} password={config.postgres_password}")
