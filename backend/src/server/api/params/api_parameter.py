from enum import Enum


class QuestionMode(str, Enum):
    ai = "ai"
    random = "random"
    incorrect = "incorrect"
