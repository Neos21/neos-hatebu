import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment-timezone';

import { NgDataService } from '../../../shared/services/ng-data.service';
import { PageDataService } from '../../../shared/services/page-data.service';
import { NgUrl } from '../../../shared/classes/ng-url';

/**
 * NG URL Setting Component
 */
@Component({
  selector: 'app-ng-url-setting',
  templateUrl: './ng-url-setting.component.html',
  styleUrls: ['./ng-url-setting.component.scss']
})
export class NgUrlSettingComponent implements OnInit {
  /** 読込中のフィードバックメッセージ */
  public isLoading: boolean = true;
  /** 削除する日付の設定フォーム */
  public removeForm: FormGroup;
  /** NG URL 一覧 */
  public ngUrls: NgUrl[] = [];
  /** フィードバックメッセージ */
  public message: string = '';
  /** 全件表示中か否か (true で全件表示・false で省略表示) */
  public isShownAll: boolean = false;
  
  /**
   * コンストラクタ
   * 
   * @param formBuilder FormBuilder
   * @param pageDataService PageDataService
   * @param ngDataService NgDataService
   */
  constructor(
    private formBuilder: FormBuilder,
    private pageDataService: PageDataService,
    private ngDataService: NgDataService
  ) { }
  
  /**
   * 画面初期表示時の処理
   */
  public ngOnInit(): void {
    // ページタイトルを設定する
    this.pageDataService.pageTitleSubject.next('NG URL 設定');
    
    // 5日前の日付を初期値に設定する
    const defaultValue = moment().subtract(5, 'days').format('YYYY-MM-DD');
    this.removeForm = this.formBuilder.group({
      date: [defaultValue, [Validators.required]]
    });
    
    // NG URL 一覧を強制再取得し画面に設定する
    this.ngDataService.findNgUrls(true)
      .then((ngUrls) => {
        this.isLoading = false;
        this.ngUrls = this.convertNgUrls(ngUrls, true);
      })
      .catch((error) => {
        this.isLoading = false;
        console.error('NG URL 一覧取得 : 失敗', error);
        this.message = `NG URL 一覧取得に失敗 : ${JSON.stringify(error)}`;
      });
  }
  
  /**
   * 全件表示と省略表示を切り替える
   */
  public onToggleShow(): void {
    this.message = '';
    
    // キャッシュがあればキャッシュから全件表示する
    this.ngDataService.findNgUrls()
      .then((ngUrls) => {
        // 全件表示と省略表示をトグルする
        this.isShownAll = !this.isShownAll;
        this.ngUrls = this.convertNgUrls(ngUrls, this.isShownAll);
      })
      .catch((error) => {
        console.error('NG URL 一覧取得 : 失敗', error);
        this.message = `NG URL 一覧取得に失敗 : ${JSON.stringify(error)}`;
      });
  }
  
  /**
   * 指定の日付以前の NG URL を削除する
   */
  public onRemoveNgUrls(): void {
    this.message = '';
    
    this.ngDataService.removeNgUrls(this.removeForm.value.date)
      .then((ngUrls) => {
        // 強制再取得したものを設定する・省略表示か否かのフラグは参照のみ
        this.ngUrls = this.convertNgUrls(ngUrls, this.isShownAll);
      })
      .catch((error) => {
        console.error('NG URL 削除 : 失敗', error);
        this.message = `NG URL 削除に失敗 : ${JSON.stringify(error)}`;
      });
  }
  
  /**
   * NG URL 一覧を、条件に応じて省略し、日付を変換して返す
   * 
   * @param ngUrls NG URL 一覧
   * @param isShownAll 50件に絞る場合は false
   * @return NG URL 一覧
   */
  private convertNgUrls(ngUrls: NgUrl[], isShownAll: boolean): NgUrl[] {
    if(!isShownAll) {
      // tslint:disable-next-line:no-parameter-reassignment
      ngUrls = ngUrls.slice(0, 50);
    }
    
    return ngUrls.map((ngUrl) => {
      ngUrl.createdAt = moment(ngUrl.createdAt).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss');
      return ngUrl;
    });
  }
}
