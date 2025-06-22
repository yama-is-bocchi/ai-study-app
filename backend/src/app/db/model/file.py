from pydantic import BaseModel, Field


class FileInfo(BaseModel):
    name: str
    data: str


class ReportCache(BaseModel):
    answer_count: int = Field(default=0)
    report: str = Field(default="")
