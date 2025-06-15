from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app import AppContext, get_app_context
from server.api.lib.params.api_parameter import QuestionMode

api_router = APIRouter()
"""REST APIのエンドポイントを定義"""


@api_router.get("/question")
async def get_question(
    context: Annotated[AppContext, Depends(get_app_context)],
    mode: Annotated[QuestionMode, Query(...)],
) -> list:
    match mode:
        case QuestionMode.ai:
            return await context.app.get_analysis_question()
        case QuestionMode.random:
            return []
        case QuestionMode.miss:
            return []


@api_router.get("/test")
async def chat(
    context: Annotated[AppContext, Depends(get_app_context)],
    chat: str,
) -> str:
    return await context.app.test_chat(chat)
