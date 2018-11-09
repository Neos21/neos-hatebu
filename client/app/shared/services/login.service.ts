import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as md5 from 'md5';

import { environment } from '../../../environments/environment.prod';

import { appConstants } from '../constants/app-constants';

/**
 * ログイン処理を行うサービス
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  /**
   * コンストラクタ
   * 
   * @param httpClient HttpClient
   */
  constructor(private httpClient: HttpClient) { }
  
  /**
   * ログインする
   * 
   * @param userName ユーザ名
   * @param inputPassword パスワード
   * @param isHashPassword 第2引数 inputPassword がハッシュ文字列かどうか (true なら関数内でハッシュ化しない・false か未指定ならハッシュ化する)
   * @return Promise
   */
  public login(userName: string, inputPassword: string, isHashPassword?: boolean): Promise<any> {
    let password = inputPassword;
    if(!isHashPassword) {
      password = md5(inputPassword);
      console.log('パスワード文字列をハッシュ化', password);
    }
    
    console.log('ログイン通信 : 開始');
    return this.httpClient.post(`${environment.serverUrl}/login`, { userName, password }).toPromise()
      .then((result: { result: string; id: string|number; userName: string }) => {
        console.log('ログイン通信 : 成功・ローカル DB にログイン情報を保存', result);
        const localStorageUserInfo = {
          id      : result.id,
          userName: result.userName,
          password: password
        };
        localStorage.setItem(appConstants.localStorage.userInfoKey, JSON.stringify(localStorageUserInfo));
      })
      .catch((error) => {
        console.error('ログイン通信 : 失敗', { userName, inputPassword, password }, error);
        return Promise.reject(error);
      });
  }
  
  /**
   * LocalStorage のデータを利用して自動で再ログインする
   * 
   * @return Promise
   */
  public autoReLogin(): Promise<any> {
    const rawUserInfo = localStorage.getItem(appConstants.localStorage.userInfoKey);
    if(!rawUserInfo) {
      console.log('LocalStorage にログインユーザ情報なし');
      return Promise.reject('LocalStorage にログインユーザ情報なし');
    }
    
    console.log('LocalStorage にログインユーザ情報あり・再ログイン開始');
    const userInfo = JSON.parse(rawUserInfo);
    return this.login(userInfo.userName, userInfo.password, true)
      .catch((error) => {
        // 通信エラー時のみ「自動再ログイン失敗」のメッセージを表示する
        sessionStorage.setItem(appConstants.sessionStorage.loginInitMessageKey, `自動再ログイン失敗 : ${JSON.stringify(error)}`);
        return Promise.reject(error);
      });
  }
}
