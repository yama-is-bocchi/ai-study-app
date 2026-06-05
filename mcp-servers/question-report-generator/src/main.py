import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

from researcher import MarkDownFileResearcher
from server import MCPServer

logging.basicConfig(level=logging.INFO)


def main() -> None:
    load_dotenv()
    base_llm = ChatOpenAI(model="gpt-4o-mini", temperature=1)
    researcher = MarkDownFileResearcher(base_llm, Path(os.getenv("RESEARCH_TARGET_PATH", "data/markdown")))
    mcp_server = MCPServer(researcher)
    mcp_server.run("stdio")


if __name__ == "__main__":
    main()
