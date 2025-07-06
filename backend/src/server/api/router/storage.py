from typing import Annotated

from fastapi import APIRouter, Depends, Request

from app import AppContext, get_app_context

storage_api_router = APIRouter()
"""DB操作のREST APIのエンドポイントを定義"""


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
    """全ファイルのメモデータをリストで返す."""
    return context.app.get_all_memo_from_storage()


@storage_api_router.delete("/{file_name}")
def delete_file(
    file_name: str,
    context: Annotated[AppContext, Depends(get_app_context)],
) -> dict[str, str]:
    """パスのファイル名のファイルを削除する."""
    context.app.delete_file_from_storage(file_name)
    return {"message": f"{file_name} deleted successfully"}
