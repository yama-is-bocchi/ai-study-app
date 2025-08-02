from pathlib import Path

from langchain_openai import ChatOpenAI

from researcher import MarkDownFileResearcher
from server import MCPServer


def main() -> None:
    base_llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    researcher = MarkDownFileResearcher(base_llm, Path("data/markdown"))
    mcp_server = MCPServer(researcher)
    mcp_server.run("stdio")


if __name__ == "__main__":
    main()
