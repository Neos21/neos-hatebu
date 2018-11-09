import { Component, OnInit } from '@angular/core';
import { NgDataService } from '../../../shared/services/ng-data.service';
import { NgWord } from '../../../shared/classes/ng-word';

/**
 * NG Word Setting Component
 */
@Component({
  selector: 'app-ng-word-setting',
  templateUrl: './ng-word-setting.component.html',
  styleUrls: ['./ng-word-setting.component.scss']
})
export class NgWordSettingComponent implements OnInit {
  /** 追加したい NG ワード入力欄 */
  public newNgWord: string = '';
  /** NG ワード一覧 */
  public ngWords: NgWord[] = [];
  
  constructor(private ngDataService: NgDataService) { }

  /**
   * 画面初期表示時の処理
   */
  public ngOnInit(): void {
    // NG ワード一覧をキャッシュから取得する
    this.ngDataService.findNgWords()
      .then((ngWords) => {
        this.ngWords = ngWords;
      });
  }
  
  /**
   * NG ワードを追加する
   */
  public onAddNgWord(): void {
    this.ngDataService.addNgWord(this.newNgWord)
      .then((createdNgWord) => {
        console.log(createdNgWord);
        // 登録した NG ワードが返されるのでキャッシュと画面表示している一覧に追加する (参照渡しで this.ngWords の方も変更が入る)
        this.ngDataService.ngWords.push(createdNgWord);
      })
      .catch((error) => {
        console.error('NG ワード追加に失敗', error);
        // TODO : エラー時にメッセージでも表示するか…
      });
  }
  
  /**
   * NG ワードを削除する
   * 
   * @param ngWordId 削除する NG ワードの ID
   */
  public onRemoveNgWord(ngWordId: string|number): void {
    this.ngDataService.removeNgWord(ngWordId)
      .then(() => {
        // キャッシュと画面表示している一覧から、対象の NG ワードを削除する
        this.ngDataService.ngWords = this.ngWords = this.ngWords.filter((ngWord) => {
          return ngWord.id !== ngWordId;
        });
      })
      .catch((error) => {
        console.error('NG ワード削除に失敗', error);
        // TODO : エラー時にメッセージでも表示するか…
      });
  }
}
