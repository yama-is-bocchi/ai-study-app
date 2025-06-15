from pydantic import BaseModel, Field


class Question(BaseModel):
    field_name: str = Field(description="分野別情報", strict=True)
    question: str = Field(description="生成した問題文", strict=True)
    answer: str = Field(description="生成した問題に対する回答", strict=True)
    correct: bool
    timestamp: float


class GeneratedQuestion(BaseModel):
    field_name: str = Field(description="分野別情報", strict=True)
    question: str = Field(description="生成した問題文", strict=True)
    answer: str = Field(description="生成した問題に対する回答", strict=True)


class FileInfo(BaseModel):
    name: str
    data: str
