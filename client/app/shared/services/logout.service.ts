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
    // LocalStorage を削除・認証するようにガードを設定する
    localStorage.removeItem(appConstants.localStorage.userInfoKey);
    this.authGuard.isLogined = false;
    
    // 各サービスでキャッシュしているデータを消しておく
    this.categoriesService.categories = [];
    this.ngDataService.ngUrls = [];
    this.ngDataService.ngWords = [];
    this.ngDataService.ngDomains = [];
    
    return this.httpClient.get(`${environment.serverUrl}/logout`).toPromise()
      .catch((error) => {
        // 通信エラーでも無視する
        console.warn('ログアウト通信 : 失敗', error);
      });
  }
}
