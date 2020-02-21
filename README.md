# Neo's Hatebu

オレオレはてなブックマーク。

__[Enter This Web App](https://neos-hatebu.herokuapp.com/)__

※ Neo 本人しかログインして利用できません。


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


## Author

[Neo](http://neo.s21.xrea.com/)


## Links

- [Neo's World](http://neo.s21.xrea.com/)
- [Corredor](https://neos21.hatenablog.com/)
- [Murga](https://neos21.hatenablog.jp/)
- [El Mylar](https://neos21.hateblo.jp/)
- [Neo's GitHub Pages](https://neos21.github.io/)
- [GitHub - Neos21](https://github.com/Neos21/)
