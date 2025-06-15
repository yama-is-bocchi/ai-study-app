from dataclasses import dataclass
from pathlib import Path


@dataclass
class StorageClient:
    dir_path: str

    def save_file(self, file_name: str, data: bytes) -> None:
        """引数のデータをディレクトリ内に保存する."""
        file_path = Path(self.dir_path) / file_name
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with file_path.open("wb") as file:
            file.write(data)
