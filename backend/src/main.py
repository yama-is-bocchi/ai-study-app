from typing import Final

from config import load_config

ENV_FILE_PATH: Final = "./../.env"
""".envファイルのパス"""


def main() -> None:
    config = load_config(ENV_FILE_PATH)
    print(config)


if __name__ == "__main__":
    main()
