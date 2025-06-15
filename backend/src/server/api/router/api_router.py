from typing import Annotated

from fastapi import APIRouter, Depends, Query, Request

from app import AppContext, get_app_context
from server.api.lib.params.api_parameter import QuestionMode

api_router = APIRouter()
"""REST APIのエンドポイントを定義"""


@api_router.get("/question")
async def get_question(
    context: Annotated[AppContext, Depends(get_app_context)],
    mode: Annotated[QuestionMode, Query(...)],
) -> list:
    """問題を取得する."""
    match mode:
        case QuestionMode.ai:
            return await context.app.get_analysis_question()
        case QuestionMode.random:
            return context.app.get_random_questions()
        case QuestionMode.incorrect:
            return context.app.get_incorrect_answers(100)


@api_router.put("/files/{file_name}")
async def upload_file(
    file_name: str,
    request: Request,
    context: Annotated[AppContext, Depends(get_app_context)],
) -> dict[str, str]:
    """パスのファイル名でファイルを保存する."""
    context.app.upload_file(file_name, await request.body())
    return {"message": f"{file_name} uploaded successfully"}
