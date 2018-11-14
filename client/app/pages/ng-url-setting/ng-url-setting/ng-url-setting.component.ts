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
  /** 削除する日付の設定フォーム */
  public removeForm: FormGroup;
  /** NG URL 一覧 */
  public ngUrls: NgUrl[] = [];
  /** フィードバックメッセージ */
  public message: string = '';
  
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
    
    // NG URL 一覧を取得し画面に設定する
    this.ngDataService.findNgUrls()
      .then((ngUrls) => {
        this.ngUrls = ngUrls.map((ngUrl) => {
          // 日時を整形する
          ngUrl.createdAt = moment(ngUrl.createdAt).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss');
          return ngUrl;
        });
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
        // キャッシュを使わず再取得したものを設定する
        this.ngUrls = ngUrls.map((ngUrl) => {
          // 日時を整形する
          ngUrl.createdAt = moment(ngUrl.createdAt).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss');
          return ngUrl;
        });
      })
      .catch((error) => {
        console.error('NG URL 削除 : 失敗', error);
        this.message = `NG URL 削除に失敗 : ${JSON.stringify(error)}`;
      });
  }
}
