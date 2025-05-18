from pathlib import Path

from langchain_core.prompts import ChatPromptTemplate


def load_system_prompt_file(system_prompt_path: str) -> ChatPromptTemplate:
    """プロンプト設定ファイルを読み込む."""
    system_prompt_file = Path(system_prompt_path)
    raw_prompt = system_prompt_file.read_text()
    return ChatPromptTemplate.from_messages([(raw_prompt), ("{input}"), ("placeholder", "{agent_scratchpad}")])
