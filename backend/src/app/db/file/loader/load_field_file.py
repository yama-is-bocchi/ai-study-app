from pathlib import Path


def load_field_file(field_file_path: str) -> list[str]:
    """改行区切りで表現された分野別の情報をリストとして取得する."""
    field_file = Path(field_file_path)
    return field_file.read_text().split("\n")
