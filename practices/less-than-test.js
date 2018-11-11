const Sequelize = require('sequelize');

require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const sequelize = new Sequelize(connectionString, {
  timezone: '+09:00',  // JST タイムゾーン : Sequelize で SELECT すると全て UTC の ISO 形式になっており DB 上の記録と異なる
});

const NgUrl = sequelize.define('ng_urls', {
  id       : { field: 'id'        , type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },  // ID (勝手に生成されるようなので用途はないが作っておく)
  userId   : { field: 'user_id'   , type: Sequelize.INTEGER, allowNull: false },  // ユーザ ID (users.id)
  url      : { field: 'url'       , type: Sequelize.TEXT   , allowNull: false },  // NG URL (イメージ的にはユーザ ID との複合ユニークだが UPSERT で対処する)
  createdAt: { field: 'created_at', type: Sequelize.DATE   , allowNull: false }   // 登録日 (一定期間後に削除するため)
}, {
  updatedAt: false
});
NgUrl.sync();

NgUrl.findAll({
  where: {
    createdAt: {
      [Sequelize.Op.lt]: new Date(2018, 10, 9, 23, 32)
    }
  }
})
  .then((results) => {
    results.forEach((result) => {
      console.log(result.dataValues);
    })
  })
  .catch((error) => {
    console.error(error);
    console.error('エラー');
  });
