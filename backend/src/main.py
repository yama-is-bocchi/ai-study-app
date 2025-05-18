import asyncio

from run import run


def main() -> None:
    # MCPアダプタが非同期呼び出しにしか対応していないのでrun.pyを用意
    asyncio.run(run())


if __name__ == "__main__":
    main()
