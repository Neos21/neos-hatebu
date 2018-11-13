# Neo's Hatebu

オレオレはてなブックマーク。

__[Enter This Web App.](https://neos-hatebu.herokuapp.com/)__

※ Neo 本人しかログインして利用できません。


## How To Clone

大体以下の流れで操作すれば同じ Web アプリが動かせるようになります。

1. Heroku プロジェクトを作成する
2. Heroku Postgres アドオンをインストールする
3. Heroku に以下の環境変数 (Config Vars) を設定する
    - `DATABASE_URL` : Herkou Postgres が自動設定
    - `IS_HTTPS` : `false`
    - `PGSSLMODE` : `allow`
4. この Git リポジトリを Fork する
5. Heroku プロジェクトに `git push` する
6. `practices/insert-master-data.js` 中の `INSERT INTO useres` 文にログインユーザの名前とパスワードの MD5 ハッシュ文字列を記述する
7. `$ node practices/insert-master-data.js` を実行し、`users` テーブルと `categories` テーブルにマスタデータを投入する
8. Heroku アプリにアクセスしてログインしてドウゾ！
9. エントリ情報を定期的に自動更新するには、Heroku Scheduler アドオンをインストールし、`$ node bin/crawl.js` を実行するようジョブを設定する


## Author

[Neo](http://neo.s21.xrea.com/) ([@Neos21](https://twitter.com/Neos21))


## Links

- [Neo's World](http://neo.s21.xrea.com/)
- [Corredor](http://neos21.hatenablog.com/)
- [Murga](http://neos21.hatenablog.jp/)
- [El Mylar](http://neos21.hateblo.jp/)
- [Bit-Archer](http://bit-archer.hatenablog.com/)
- [GitHub - Neos21](https://github.com/Neos21/)
