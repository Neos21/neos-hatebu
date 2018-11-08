import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as md5 from 'md5';

import { environment } from '../../../environments/environment.prod';

import { appConstants } from '../constants/app-constants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private httpClient: HttpClient) { }
  
  /**
   * ログイン処理
   * 
   * @param userId ユーザ ID
   * @param inputPassword パスワード
   * @param isHashPassword 第2引数 inputPassword がハッシュ文字列かどうか (true なら関数内でハッシュ化しない・false か未指定ならハッシュ化する)
   */
  public login(userId: string, inputPassword: string, isHashPassword?: boolean): Promise<any> {
    let password = inputPassword;
    if(!isHashPassword) {
      password = md5(inputPassword);
      console.log('パスワード文字列をハッシュ化', password);
    }
    
    console.log('ログイン通信 : 開始');
    return this.httpClient.post(`${environment.serverUrl}/login`, { userId, password }).toPromise()
      .then((result) => {
        console.log('ログイン通信 : 成功・ローカル DB にログイン情報を保存', result);
        localStorage.setItem(appConstants.localStorage.userInfoKey, JSON.stringify({ userId, password }));
      })
      .catch((error) => {
        console.error('ログイン通信 : 失敗', { userId, inputPassword, password }, error);
        return Promise.reject(error);
      });
  }
  
  /**
   * LocalStorage のデータを利用して自動で再ログインする
   */
  public autoReLogin(): Promise<any> {
    const rawUserInfo = localStorage.getItem(appConstants.localStorage.userInfoKey);
    if(!rawUserInfo) {
      console.log('LocalStorage にログインユーザ情報なし');
      return Promise.reject('LocalStorage にログインユーザ情報なし');
    }
    
    console.log('LocalStorage にログインユーザ情報あり・再ログイン開始');
    const userInfo = JSON.parse(rawUserInfo);
    return this.login(userInfo.userId, userInfo.password, true)
      .catch((error) => {
        // 通信エラー時のみ「自動再ログイン失敗」のメッセージを表示する
        sessionStorage.setItem(appConstants.sessionStorage.loginInitMessageKey, `自動再ログイン失敗 : ${JSON.stringify(error)}`);
        return Promise.reject(error);
      });
  }
}
