import logging
from dataclasses import dataclass

from langchain_core.language_models import BaseChatModel

from .researcher import Researcher

logger = logging.getLogger(__name__)


@dataclass
class MarkDownFileResearcher(Researcher):
    llm: BaseChatModel

    def research(self, report: str) -> str:
        return ""
