import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { appConstants } from '../constants/app-constants';
import { AuthGuard } from '../guards/auth.guard';
import { CategoriesService } from './categories.service';
import { NgDataService } from './ng-data.service';

/**
 * ログアウト処理を行うサービス
 */
@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  /**
   * コンストラクタ
   * 
   * @param httpClient HttpClient
   * @param authGuard: AuthGuard
   * @param categoriesService: CategoriesService
   * @param ngDataService: NgDataService
   */
  constructor(
    private httpClient: HttpClient,
    private authGuard: AuthGuard,
    private categoriesService: CategoriesService,
    private ngDataService: NgDataService
  ) { }
  
  /**
   * ログアウトする
   * 
   * @return Promise
   */
  public logout(): Promise<any> {
    console.log('ログアウト通信 : 開始・LocalStorage など削除し通信する');
    localStorage.removeItem(appConstants.localStorage.userInfoKey);
    this.authGuard.isLogined = false;
    
    // 各サービスでキャッシュしているデータを消しておく
    this.categoriesService.categories = [];
    this.ngDataService.ngUrls = [];
    this.ngDataService.ngWords = [];
    this.ngDataService.ngDomains = [];
    
    return this.httpClient.get(`${environment.serverUrl}/logout`).toPromise()
      .then((result) => {
        console.log('ログアウト通信 : 成功', result);
      })
      .catch((error) => {
        // 通信エラーでも無視する
        console.error('ログアウト通信 : 失敗', error);
      });
  }
}
