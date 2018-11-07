import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment.prod';

import { AppConstants } from '../constants/app-constants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private httpClient: HttpClient) { }
  
  public login(userId: string, password: string): Promise<any> {
    console.log('ログイン開始');
    return this.httpClient.post(`${environment.apiUrl}/login`, { userId, password }).toPromise()
      .then((result) => {
        console.log('ログイン成功・ローカル DB にログイン情報を保存', result);
        localStorage.setItem(AppConstants.localStorage.userInfoKey, JSON.stringify({ userId, password }));
      })
      .catch((error) => {
        console.error('ログイン失敗', { userId, password }, error);
        return Promise.reject(error);
      });
  }
}
