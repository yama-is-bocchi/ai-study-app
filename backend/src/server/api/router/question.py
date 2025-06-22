from typing import Annotated

from fastapi import APIRouter, Depends, Query, Request

from app import AppContext, get_app_context
from server.api.lib.params.api_parameter import QuestionMode

question_api_router = APIRouter()
"""REST APIのエンドポイントを定義"""


@question_api_router.get("/")
async def get_question(
    context: Annotated[AppContext, Depends(get_app_context)],
    mode: Annotated[QuestionMode, Query(...)],
) -> list | dict:
    """問題を取得する."""
    match mode:
        case QuestionMode.ai:
            return await context.app.get_analysis_question()
        case QuestionMode.random:
            return context.app.get_random_questions()
        case QuestionMode.incorrect:
            return context.app.get_incorrect_answers(100)


@question_api_router.post("/answer")
async def register_answer(request: Request, context: Annotated[AppContext, Depends(get_app_context)]) -> dict[str, str]:
    """回答データをデータベースに登録する."""
    context.app.register_answer_to_psql(await request.body())
    return {"message": "answer data has been successfully registered"}
