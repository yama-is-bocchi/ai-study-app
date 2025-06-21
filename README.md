# AI-Study-App
LLMによる課題生成アプリ

# 開発環境の構築
## サーバーの起動
1. devcontainerを開いてください
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
6. `uv run src/main.py` でサーバーを起動できます。

## UIの開発
1. `cd frontend` で移動。
2. `bun install` でnode_modulesを追加してください。
3. `bun run dev` で開発を開始できます。
### biome の豆知識
- `frontend/biome.json`に各設定項目が載っています。
- `shift` + `alt` + `o` でorganize import を実行する。

## PostgreSQL
データベースとの接続は `psql` コマンドを利用します。
### 接続方法
1. `psql -h dev_db -U vscode`でホスト名、ユーザーを指定して接続します。
2. パスワードの入力を求められるので、`postgres`と入力してください。
### テーブル確認コマンド 一覧
- テーブル一覧 -> `\dt`
- テーブルの属性表示 -> `\d {テーブル名}`
- テーブル内のレコード確認 -> `SELECT * FROM {テーブル名};`