from pydantic import BaseModel, Field


class Question(BaseModel):
    question: str = Field(description="field_tableの内容を参考にして生成した問題")
    answer: str = Field(description="生成した問題に対する回答")
