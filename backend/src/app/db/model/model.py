from datetime import datetime

from pydantic import BaseModel, Field


class Question(BaseModel):
    field_name: str = Field(description="分野別情報")
    question: str = Field(description="生成した問題文")
    answer: str = Field(description="生成した問題に対する回答")
    correct: bool | None = None
    timestamp: datetime
