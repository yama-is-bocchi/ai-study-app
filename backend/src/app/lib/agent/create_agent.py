from pathlib import Path

from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.language_models import BaseLanguageModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import BaseTool


def create_agent(llm: BaseLanguageModel, tool_list: list[BaseTool], system_prompt_file_path: str) -> AgentExecutor:
    """エージェントを作成する."""
    # プロンプトを取得
    raw_prompt = load_system_prompt(system_prompt_file_path)
    prompt = ChatPromptTemplate.from_messages([(raw_prompt), ("{input}"), ("placeholder", "{agent_scratchpad}")])
    # エージェント作成
    base_agent = create_tool_calling_agent(llm, tool_list, prompt)
    return AgentExecutor(agent=base_agent, tools=tool_list)


def load_system_prompt(system_prompt_path: str) -> str:
    """プロンプト設定ファイルを読み込む."""
    data_dir = Path(system_prompt_path)
    return data_dir.read_text()
