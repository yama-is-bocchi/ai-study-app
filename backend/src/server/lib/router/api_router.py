from typing import Annotated

from fastapi import APIRouter, Depends

from app import AppContext, get_app_context

api_router = APIRouter()


@api_router.get("/question")
def get_hello(context: Annotated[AppContext, Depends(get_app_context)]) -> dict[str, str]:
    return {"message": f"hello {context}"}
