const Controller = require('./controller');
const ExampleModel  = require('../models/example-model');
const ExampleEntity = require('../entities/example-entity');

/**
 * Examples Controller
 */
class ExamplesController {
  /**
   * コンストラクタ
   */
  constructor() {
    this.controller = new Controller();
    this.exampleModel = new ExampleModel();
  }
  
  /**
   * 全件取得する
   * 
   * @param res レスポンス
   */
  findAll(res) {
    this.exampleModel.findAll()
      .then(this.controller.findSuccess(res))
      .catch(this.controller.findError(res));
  }
  
  /**
   * ID を指定して1件取得する
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  findById(req, res) {
    const id = req.params.id;
    
    this.exampleModel.findById(id)
      .then(this.controller.findSuccess(res))
      .catch(this.controller.findError(res));
  }
  
  /**
   * 登録する
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  create(req, res) {
    const example = new ExampleEntity();
    // example.id = req.body.id;
    example.name = req.body.name;
    example.age = req.body.age;
    
    this.exampleModel.create(example)
      .then(this.controller.createSuccess(res))
      .catch(this.controller.editError(res));
  }
  
  /**
   * 登録 or 更新する
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  update(req, res) {
    const example = new ExampleEntity(req.body.id, req.body.name, req.body.age);
    
    this.exampleModel.update(example)
      .then(this.controller.editSuccess(res))
      .catch(this.controller.editError(res));
  }
  
  /**
   * 削除する
   * 
   * @param req リクエスト
   * @param res レスポンス
   */
  delete(req, res) {
    const id = req.params.id;
    
    this.exampleModel.delete(id)
      .then(this.controller.editSuccess(res))
      .catch((error) => {
        if(error.errorCode === 21) {
          // 削除対象がなかった場合は 404
          return this.controller.deleteError(res)();
        }
        else {
          return this.controller.editError(res)();
        }
      });
  }
}

module.exports = ExamplesController;
