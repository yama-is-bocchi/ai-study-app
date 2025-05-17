from fastapi import APIRouter

api_router = APIRouter()


@api_router.get("/question")
def get_hello() -> dict[str, str]:
    return {"message": "hello"}
