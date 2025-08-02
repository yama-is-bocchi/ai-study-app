from abc import ABC, abstractmethod


class Researcher(ABC):
    @abstractmethod
    def research(self, report: str) -> str: ...
