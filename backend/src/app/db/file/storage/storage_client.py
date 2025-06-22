import json
from pathlib import Path
from typing import TypeVar

from pydantic import BaseModel

from app.db.model import FileInfo

T = TypeVar("T", bound=BaseModel)


class StorageClient:
    def __init__(self, dir_path: str) -> None:
        self._dir_path = Path(dir_path)

    def save_file(self, file_name: str, data: bytes) -> None:
        """引数のデータをディレクトリ内に保存する."""
        file_path = self._dir_path / file_name
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with file_path.open("wb") as file:
            file.write(data)

    def read_json_file(self, file_name: str, schema: type[T]) -> T:
        """引数のスキーマでJSONファイルを読み込む."""
        json_file = self._dir_path / file_name
        if not json_file.exists():
            json_file.write_text(schema().model_dump_json(indent=2), encoding="utf-8")
        data = json.loads(json_file.read_text(encoding="utf-8"))
        return schema(**data)

    def read_all_markdown_files(self, limit: int = 100) -> list[FileInfo]:
        """マークダウンファイルの内容を制限付きで取得する。ファイル名でソートされる."""
        # ファイル名でソート
        files = sorted(
            self._dir_path.glob("*.md"),
            key=lambda file: file.stem,
            reverse=True,
        )
        result = []
        for file in files[:limit]:
            data = file.read_text(encoding="utf-8")
            result.append(FileInfo(name=file.name, data=data))

        return result

    def delete_file(self, file_name: str) -> None:
        """対象のファイル名のデータを削除する."""
        file_path = self._dir_path / file_name
        if file_path.exists():
            file_path.unlink()
            return
        msg = "Not found :%s"
        raise FileNotFoundError(msg, file_path)
