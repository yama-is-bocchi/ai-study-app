import logging


class SymbolFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        level_to_symbol = {
            "DEBUG": "🔍",
            "INFO": "✔",
            "WARNING": "⚠",
            "ERROR": "✖",
            "CRITICAL": "💥",
        }
        record.symbol = level_to_symbol.get(record.levelname, " ")
        return True
