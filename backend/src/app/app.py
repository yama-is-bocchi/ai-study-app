from .config import Config
from .db import PsqlClient
from .db.file.loader import load_field_file
from .lib.logger import get_logger

logger = get_logger(__name__)


class App:
    """DB操作,エージェントを利用したアプリケーションを提供する."""

    def __init__(self, config: Config) -> None:
        # psqlクライアントを追加
        self._analysis_agent = config.analysis_agent
        self._psql_client = PsqlClient(f"host={config.postgres_host_name} dbname={config.postgres_user} user={config.postgres_user} password={config.postgres_password}")
        self._psql_client.create_tables()
        # 分野別情報を取得してレコードを書き込む
        field_list = load_field_file(config.field_config_file_path)
        self._psql_client.insert_filed_table(field_list)
        logger.info("Successful create application")
