from typing import Final

from app import App, load_config

ENV_FILE_PATH: Final = "./../.env"
""".envファイルのパス"""


def main() -> None:
    # 環境変数をロード
    config = load_config(ENV_FILE_PATH)
    app = App(config)


if __name__ == "__main__":
    main()
