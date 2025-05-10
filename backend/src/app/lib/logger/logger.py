import logging
from typing import Literal


def get_logger(name: str, level: Literal[20] = logging.INFO) -> logging.Logger:
    """モジュール単位のloggerを取得する."""
    logger = logging.getLogger(name)
    logger.setLevel(level)

    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter("[%(asctime)s] %(levelname)s - %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger
