const Model = require('./model');
const ExampleEntity = require('../entities/example-entity');

/**
 * Example Model
 */
class ExampleModel {
  /**
   * コンストラクタ
   */
  constructor() {
    this.model = new Model();
  }
  
  /**
   * 全件取得する
   * 
   * @return Entity の配列を Resolve する
   */
  findAll() {
    const sql = `
      SELECT
          id,
          name,
          age
      FROM
          example
    `;
    
    return this.model.findAll(sql)
      .then((rows) => {
        const examples = [];
        
        for(const row of rows) {
          examples.push(new ExampleEntity(row.id, row.name, row.age));
        }
        
        return examples;
      });
  }
  
  /**
   * ID を指定して1件検索する
   * 
   * @param id ID
   * @return Entity を Resolve する
   */
  findById(id) {
    const sql = `
      SELECT
          id,
          name,
          age
      FROM
          example
      WHERE
          id = $id
    `;
    const params = {
      $id: id
    };
    
    return this.model.findOne(sql, params)
      .then((row) => {
        return new ExampleEntity(row.id, row.name, row.age);
      });
  }
  
  /**
   * 登録する
   * 
   * @param example 登録情報を持つ Entity
   * @return 登録できたら Resolve する
   */
  create(example) {
    // ID は自動採番させる
    const sql = `
      INSERT INTO example (
          name,
          age
      ) VALUES (
          $name,
          $age
      )
    `;
    const params = {
      $name: example.name,
      $age : example.age
    };
    
    return this.model.run(sql, params)
      .then((id) => {
        // 登録したデータを返却する
        return this.findById(id);
      });
  }
  
  /**
   * 登録 or 更新する
   * 
   * @param example 更新情報を持つ Entity
   * @return 登録 or 更新できたら Resolve する
   */
  update(example) {
    const sql = `
      REPLACE INTO example (
          id,
          name,
          age
      ) VALUES (
          $id,
          $name,
          $age
      )
    `;
    const params = {
      $id  : example.id,
      $name: example.name,
      $age : example.age
    };
    
    return this.model.run(sql, params);
  }
  
  /**
   * 削除する
   * 
   * @param id ID
   * @return 削除できたら Resolve する
   */
  delete(id) {
    const sql = `
      DELETE FROM
          example
      WHERE
          id = $id
    `;
    const params = {
      $id: id
    };
    
    return this.model.run(sql, params);
  }
}

module.exports = ExampleModel;
