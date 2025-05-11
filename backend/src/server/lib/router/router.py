from fastapi import APIRouter

api_router = APIRouter()


@api_router.get("/hello")
def get_hello() -> dict[str, str]:
    return {"message": "hello"}
