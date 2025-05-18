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
) -> dict[str, str]:
    match mode:
        case QuestionMode.ai:
            # appからlist[dict[str,str]]を取得
            ans = await context.app.get_analysis_question()
            return {"message": f"ai {ans}"}
        case QuestionMode.random:
            return {"message": f"random {context}"}
        case QuestionMode.miss:
            return {"message": f"miss {context}"}
