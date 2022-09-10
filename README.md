# Neo's Hatebu 1

オレオレはてなブックマーク。

- 後継プロジェクトはコチラ → __[Neo's Hatebu 2](https://github.com/Neos21/neos-hatebu-2)__
- `https://neos-hatebu.herokuapp.com/` … 2022-09-10 閉鎖


## How To Clone

大体以下の流れで操作すれば同じ Web アプリが動かせるようになります。

1. Heroku プロジェクトを作成する
2. Heroku Postgres アドオンをインストールする
3. Heroku に以下の環境変数 (Config Vars) を設定する
    - `DATABASE_URL` : Herkou Postgres が自動設定
    - `PGSSLMODE` : `allow`
4. この Git リポジトリを Fork する
5. `client/environments/environment.prod.ts` の `serverUrl` を 1. で作成した Heroku プロジェクトの URL に変更する
6. Heroku プロジェクトに `git push` する (Heroku アプリ起動時に Sequelize にテーブルを生成させている)
7. `practices/insert-master-data.js` 中の `INSERT INTO useres` 文にログインユーザの名前とパスワードの MD5 ハッシュ文字列を記述する
8. `$ node practices/insert-master-data.js` を実行し、`users` テーブルと `categories` テーブルにマスタデータを投入する
9. Heroku アプリにアクセスしてログインしてドウゾ！
10. エントリ情報を定期的に自動更新するには、Heroku Scheduler アドオンをインストールし、`$ node bin/crawl.js` を実行するようジョブを設定する


## Local Development

- `./.env` Or `./.env-local` : Environment Variables
- `./client/environments/environment.ts` And `environment.prod.ts` : Server URL
- `./server/index.js` : CORS
- `./server/models/model.js` And `./bin/crawl.js` : PostgreSQL Connection


## Links

- [Neo's World](https://neos21.net/)
