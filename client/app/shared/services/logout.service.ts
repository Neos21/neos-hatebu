import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { appConstants } from '../constants/app-constants';

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
   */
  constructor(private httpClient: HttpClient) { }
  
  /**
   * ログアウトする
   * 
   * @return Promise
   */
  public logout(): Promise<any> {
    console.log('ログアウト通信 : 開始・LocalStorage からログインユーザ情報を削除する');
    localStorage.removeItem(appConstants.localStorage.userInfoKey);
    
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
