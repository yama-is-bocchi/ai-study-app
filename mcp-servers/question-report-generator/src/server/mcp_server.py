import logging
from dataclasses import dataclass
from typing import Literal

from mcp.server.fastmcp import FastMCP

from researcher import Researcher

logger = logging.getLogger(__name__)


@dataclass
class MCPServer:
    researcher: Researcher

    def run(self, mode: Literal["stdio", "sse"]) -> None:
        mcp = FastMCP(__name__)

        @mcp.tool()
        def search_report() -> str:
            """問題をの参考になるレポートをシラバスなどから調査してレポートをまとめる."""
            try:
                result = self.researcher.research()
            except Exception:
                logger.exception("failed to search report:")
                return "レポートの検索が失敗しました。"
            return result

        logger.info("The MCP server is running with %s transport", mode)
        mcp.run(transport=mode)
