from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app import AppContext, get_app_context

from .api_parameter import QuestionMode

api_router = APIRouter()
"""REST APIのエンドポイントを定義"""


@api_router.get("/question")
def get_question(
    context: Annotated[AppContext, Depends(get_app_context)],
    mode: Annotated[QuestionMode, Query(...)],
) -> dict[str, str]:
    match mode:
        case QuestionMode.ai:
            return {"message": f"ai {context}"}
        case QuestionMode.random:
            return {"message": f"random {context}"}
        case QuestionMode.miss:
            return {"message": f"miss {context}"}
