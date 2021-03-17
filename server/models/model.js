// ローカルから通信する際に SSL 通信を必須にする
//require('pg').defaults.ssl = true;

const Sequelize = require('sequelize');

// 環境変数をロードする
require('dotenv').config();

/**
 * Sequelize と生成したモデルを返却する
 */
const Model = {};

// DB 接続する
const connectionString = process.env.DATABASE_URL;
const sequelize = new Sequelize(connectionString, {
  timezone: '+09:00',  // JST タイムゾーン : Sequelize で SELECT すると全て UTC の ISO 形式になっており DB 上の記録と異なる
  logging: false,  // ログ出力
  // SSL 接続のため指定する
  dialect: 'postgres',
  dialectOptions: {
    ssl: true,
    rejectUnauthorized: false
  }
});

// 各モデルを定義・格納する
Model.User     = require('./user-model'     )(sequelize);
Model.Category = require('./category-model' )(sequelize);
Model.Entry    = require('./entry-model'    )(sequelize);
Model.NgUrl    = require('./ng-url-model'   )(sequelize);
Model.NgWord   = require('./ng-word-model'  )(sequelize);
Model.NgDomain = require('./ng-domain-model')(sequelize);

// 各モデルが associate() 関数を定義していれば実行し、関係を定義する
Object.keys(Model).forEach((key) => {
  const model = Model[key];
  if(model.associate) {
    model.associate(Model);
  }
});

// Sequelize を格納する
Model.Sequelize = Sequelize;
Model.sequelize = sequelize;

module.exports = Model;
