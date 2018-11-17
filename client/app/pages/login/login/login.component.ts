import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { appConstants } from '../../../shared/constants/app-constants';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { LoginService } from '../../../shared/services/login.service';
import { PageDataService } from '../../../shared/services/page-data.service';

/**
 * Login Component
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
   * @param pageDataService PageDataService
   * @param loginService LoginService
   * @param authGuard AuthGuard
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private pageDataService: PageDataService,
    private loginService: LoginService,
    private authGuard: AuthGuard
  ) { }
  
  /**
   * 画面初期表示時の処理
   */
  public ngOnInit(): void {
    // ページタイトルを設定する
    this.pageDataService.pageTitleSubject.next(`Neo's Hatebu`);
    
    // フォームを定義する
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    
    // ログイン画面に遷移した時はログインユーザ情報を削除しておく
    localStorage.removeItem(appConstants.localStorage.userInfoKey);
    
    // ログイン処理未済の状態としてガードを設定しておく
    this.authGuard.isLogined = false;
    
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
    this.loginService.login(this.loginForm.value.userName, this.loginForm.value.password)
      .then(() => {
        // 成功・二重にログイン処理がされないようガードを設定しておく (LoginService 内でやろうとすると AuthGuard と循環依存するためココで行う)
        this.authGuard.isLogined = true;
        this.router.navigate(['/home'], {
          queryParams: {
            categoryId: '1'
          }
        });
      })
      .catch((error) => {
        console.warn('ログイン失敗', error);
        this.message = `ログイン失敗 : ${JSON.stringify(error)}`;
      });
  }
}
