import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './shared/services/login.service';
import { AppConstants } from './shared/constants/app-constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }
  
  public ngOnInit(): void {
    const rawUserInfo = localStorage.getItem(AppConstants.localStorage.userInfoKey);
    if(!rawUserInfo) {
      console.log('ログインユーザ情報なし・ログイン画面に遷移する');
      this.router.navigate(['/login']);
      return;
    }
    
    console.log('ログインユーザ情報あり・自動ログイン開始');
    const userInfo = JSON.parse(rawUserInfo);
    this.loginService.login(userInfo.userId, userInfo.password)
      .then(() => {
        console.log('自動ログイン成功・トップ画面に遷移する');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log('自動ログイン失敗・ログイン画面に遷移する');
        this.router.navigate(['/login']);
      });
  }
}
