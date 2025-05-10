# AI-Study-App
LLMによる課題生成アプリ

# 環境構築
1. 開発コンテナを開いてください
2. `.env.example`を参考に設定後、環境変数を公開してください。
    ```
    export $(cat .env | xargs)
    ```
3. `cd backend` -> `uv sync`を実行して環境を同期してください。
4. `backend/data/conf/mcp_config.json`を設定してください。<br>
    ※開発コンテナであればこのままコピーしてください。<br>本番環境 -> postgresql://user:password@host:port/db-name
    ```
    {
        "mcpServers": {
            "filesystem": {
                "command": "npx",
                "args": [
                    "-y",
                    "@modelcontextprotocol/server-filesystem",
                    "/workspace"
                ]
            },
            "postgres": {
                "command": "npx",
                "args": [
                    "-y",
                    "@modelcontextprotocol/server-postgres",
                    "postgresql://vscode:postgres@dev_db/vscode"
                ]
            }
        }
    }
    ```
5. `backend/data/conf/system_prompt.md` にシステムプロンプトを設定してください。