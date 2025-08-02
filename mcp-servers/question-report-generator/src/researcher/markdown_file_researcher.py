import logging
from pathlib import Path

from langchain_core.language_models import BaseChatModel

from .researcher import Researcher

logger = logging.getLogger(__name__)


class MarkDownFileResearcher(Researcher):
    _report_cache_file_name: str = "report.md"

    def __init__(self, llm: BaseChatModel, dir_path: Path) -> None:
        # ディレクトリ内の全MDファイルを読み取り、レポートを生成する
        pass

    def research(self) -> str:
        # レポートを返す
        return ""
