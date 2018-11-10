import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NgDataService } from '../../../shared/services/ng-data.service';
import { NgDomain } from '../../../shared/classes/ng-domain';

/**
 * NG Domain Setting Component
 */
@Component({
  selector: 'app-ng-domain-setting',
  templateUrl: './ng-domain-setting.component.html',
  styleUrls: ['./ng-domain-setting.component.scss']
})
export class NgDomainSettingComponent implements OnInit {
  /** 追加欄 */
  public newForm: FormGroup;
  /** NG ドメイン一覧 */
  public ngDomains: NgDomain[] = [];
  /** フィードバックメッセージ */
  public message: string = '';
  
  /**
   * コンストラクタ
   * 
   * @param formBuilder Formbuilder
   * @param ngDataService NgDataService
   */
  constructor(
    private formBuilder: FormBuilder,
    private ngDataService: NgDataService
  ) { }
  
  /**
   * 画面初期表示時の処理
   */
  public ngOnInit(): void {
    // フォームを生成する
    this.newForm = this.formBuilder.group({
      domain: ['', [Validators.required]]
    });
    
    // NG ドメイン一覧を取得する
    this.ngDataService.findNgDomains()
      .then((ngDomains) => {
        this.ngDomains = ngDomains;
      })
      .catch((error) => {
        console.error('NG ドメイン一覧取得 : 失敗', error);
        this.message = `NG ドメイン一覧取得に失敗 : ${JSON.stringify(error)}`;
      });
  }
  
  /**
   * NG ドメインを追加する
   */
  public onAddNgDomain(): void {
    const newDomain = this.newForm.value.domain;
    
    if(this.ngDomains.some((ngDomain) => {
      return ngDomain.domain === newDomain;
    })) {
      this.message = `${newDomain} は登録済です。`;
      this.newForm.reset();
      return;
    }
    
    // サービス内で ngDomains の要素を追加している・参照渡しで利用している画面側では操作不要
    this.ngDataService.addNgDomain(newDomain)
      .then(() => {
        this.newForm.reset();
      })
      .catch((error) => {
        console.error('NG ドメイン追加 : 失敗', error);
        this.message = `NG ドメイン追加に失敗 : ${JSON.stringify(error)}`;
      });
  }
  
  /**
   * NG ドメインを削除する
   * 
   * @param ngDomainId 削除する NG ドメインの ID
   */
  public onRemoveNgDomain(ngDomainId: string|number): void {
    // サービス内で ngDomains の要素を削除している・参照渡しで利用している画面側では操作不要
    this.ngDataService.removeNgDomain(ngDomainId)
      .catch((error) => {
        console.error('NG ドメイン削除 : 失敗', error);
        this.message = `NG ドメイン削除に失敗 : ${JSON.stringify(error)}`;
      });
  }
}
