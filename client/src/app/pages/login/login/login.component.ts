import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../../../shared/services/login.service';
import { AppConstants } from '../../../shared/constants/app-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public message: string = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) { }

  public ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userId  : ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    
    // ログイン画面に遷移した時はログインユーザ情報を削除しておく
    localStorage.removeItem(AppConstants.localStorage.userInfoKey);
  }
  
  public onSubmit(): void {
    if(this.loginForm.invalid) {
      this.message = 'フォーム不正';
      return;
    }
    
    this.loginService.login(this.loginForm.value.userId, this.loginForm.value.password)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log('ログイン失敗', error);
        this.message = `ログイン失敗 : ${JSON.stringify(error)}`;
      });
  }
}
