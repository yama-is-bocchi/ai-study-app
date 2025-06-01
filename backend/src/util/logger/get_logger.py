import logging

import colorlog

from .symbol_filter import SymbolFilter


def get_logger(name: str, level: int = logging.INFO) -> logging.Logger:
    """カスタムロガーを取得できるよ!."""
    logger = logging.getLogger(name)
    logger.setLevel(level)

    if not logger.handlers:
        handler = colorlog.StreamHandler()

        formatter = colorlog.ColoredFormatter(
            "%(log_color)s%(symbol)s  ▶ [%(asctime)s] ✦ %(levelname)s ✦ %(name)s:%(lineno)d » %(reset)s%(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
            log_colors={
                "DEBUG": "blue",
                "INFO": "green",
                "WARNING": "yellow",
                "ERROR": "bold_red",
                "CRITICAL": "bold_purple",
            },
        )
        handler.setFormatter(formatter)
        handler.addFilter(SymbolFilter())

        logger.addHandler(handler)

    return logger
