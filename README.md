# AI-Study-App
LLMによる課題生成アプリ

# 環境構築
## サーバーの起動
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
                    "/workspace/backend/data/memo"
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

## PostgreSQL
データベースとの接続は `psql` コマンドを利用します。
### 接続方法
1. `psql -h dev_db -U vscode`でホスト名、ユーザーを指定して接続します。
2. パスワードの入力を求められるので、`postgres`と入力してください。
### テーブル確認コマンド 一覧
- テーブル一覧 -> `\dt`
- テーブルの属性表示 -> `\d {テーブル名}`
- テーブル内のレコード確認 -> `SELECT * FROM {テーブル名};`