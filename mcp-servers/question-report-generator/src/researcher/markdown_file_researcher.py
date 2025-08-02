import logging
import multiprocessing
import textwrap
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from langchain_core.language_models import BaseChatModel
from langchain_core.prompts import PromptTemplate

from .researcher import Researcher

logger = logging.getLogger(__name__)


class MarkDownFileResearcher(Researcher):
    _cache_report: str
    _llm: BaseChatModel

    def __init__(self, llm: BaseChatModel, dir_path: Path) -> None:
        # ディレクトリ内の全MDファイルを読み取り、レポートを生成する
        self._llm = llm
        with ThreadPoolExecutor(max_workers=multiprocessing.cpu_count()) as executor:
            md_files = list(dir_path.rglob("*.md"))
            logger.info("detected %d markdown files", len(md_files))
            futures = {executor.submit(self._process_md_file, path): path for path in md_files}
            reports = [future.result() for future in as_completed(futures)]
        # レポートをマージする
        self._cache_report = self._merge_reports(reports)

    def research(self) -> str:
        # レポートを返す
        return self._cache_report

    # ファイル単位で処理する関数
    def _process_md_file(self, path: Path) -> str:
        text = path.read_text(encoding="utf-8")
        chunks = self._split_text_by_length(text, max_length=25600)
        # 各チャンクのレポートをまとめさせる
        with ThreadPoolExecutor(max_workers=multiprocessing.cpu_count()) as executor:
            futures = [executor.submit(self._summarize_chunk, chunk) for chunk in chunks]
            reports = [future.result() for future in as_completed(futures)]
        return self._merge_reports(reports)

    def _split_text_by_length(self, text: str, max_length: int = 25600) -> list[str]:
        return textwrap.wrap(text, max_length)

    def _summarize_chunk(self, text: str) -> str:
        logger.info("summarizing chunk")
        prompt = PromptTemplate(
            input_variables=["text"],
            template="""
            # Task
            下記のテキストは記事や資料の一部です。
            テキストの内容を500文字程度で詳細に要約してください。
            また、重要語句を重点的に抽出してください。
            ---
            テキスト:
            {text}
            """,
        )
        response = (prompt | self._llm).invoke({"text": text})
        return response.text()

    def _merge_reports(self, reports: list[str]) -> str:
        logger.info("merging reports...")
        prompt = PromptTemplate(
            input_variables=["reports"],
            template="""
            # Task
            あなたは優秀なレポートマージャーです。
            複数のレポートを参照して、一つの詳細なレポートを作成してください。
            また、重要語句を重点的に抽出してください。
            ---
            レポート:
            {reports}
            """,
        )
        response = (prompt | self._llm).invoke({"reports": reports})
        return response.text()
