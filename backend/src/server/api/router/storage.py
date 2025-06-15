from typing import Annotated

from fastapi import APIRouter, Depends, Request

from app import AppContext, get_app_context

storage_api_router = APIRouter()
"""REST APIのエンドポイントを定義"""


@storage_api_router.put("/{file_name}")
async def upload_file(
    file_name: str,
    request: Request,
    context: Annotated[AppContext, Depends(get_app_context)],
) -> dict[str, str]:
    """パスのファイル名でファイルを保存する."""
    context.app.upload_file(file_name, await request.body())
    return {"message": f"{file_name} uploaded successfully"}


@storage_api_router.get("/memo")
def get_all_files(context: Annotated[AppContext, Depends(get_app_context)]) -> list:
    """全ファイルのデータをリストで返す."""
    return context.app.get_all_memo_from_storage()
