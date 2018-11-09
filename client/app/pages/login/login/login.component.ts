import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../../../shared/services/login.service';
import { appConstants } from '../../../shared/constants/app-constants';

/**
 * Login Component : ログイン画面
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /** ログインフォーム */
  public loginForm: FormGroup;
  /** フィードバックメッセージ */
  public message: string = '';
  
  /**
   * コンストラクタ
   * 
   * @param formBuilder FormBuilder
   * @param router Router
   * @param loginService LoginService
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) { }
  
  /**
   * 画面初期表示時の処理
   */
  public ngOnInit(): void {
    // フォームを定義する
    this.loginForm = this.formBuilder.group({
      userId  : ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    
    // ログイン画面に遷移した時はログインユーザ情報を削除しておく
    localStorage.removeItem(appConstants.localStorage.userInfoKey);
    
    // 初期表示時に表示するフィードバックメッセージがあれば表示する
    const initMessage = sessionStorage.getItem(appConstants.sessionStorage.loginInitMessageKey);
    sessionStorage.removeItem(appConstants.sessionStorage.loginInitMessageKey);
    if(initMessage) {
      this.message = initMessage;
    }
  }
  
  /**
   * 「ログイン」ボタン押下時の処理
   */
  public onSubmit(): void {
    this.loginService.login(this.loginForm.value.userId, this.loginForm.value.password)
      .then(() => {
        console.log('ログイン成功');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log('ログイン失敗', error);
        this.message = `ログイン失敗 : ${JSON.stringify(error)}`;
      });
  }
}
