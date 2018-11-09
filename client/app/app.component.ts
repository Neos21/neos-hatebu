import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './shared/services/login.service';

/**
 * App Component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /**
   * コンストラクタ
   * 
   * @param router Router
   * @param loginService LoginService
   */
  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }
  
  /**
   * アプリ起動時に自動再ログインできればトップ画面に移動する
   */
  public ngOnInit(): void {
    this.loginService.autoReLogin()
      .then(() => {
        console.log('自動ログイン成功・トップ画面に遷移する');
        this.router.navigate(['/home']);
      })
      .catch((_error) => {
        console.log('自動ログイン失敗・ログイン画面に遷移する');
        this.router.navigate(['/login']);
      });
  }
}
