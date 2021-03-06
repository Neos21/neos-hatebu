import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { LoginService } from '../services/login.service';

/**
 * 認証ガード
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /** ログイン試行したかどうか (セッションの有無) */
  public isLogined: boolean = false;
  
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
   * 遷移前の認証チェック
   * 
   * @param _next ActivatedRouteSnapshot
   * @param _state RouterStateSnapshot
   * @return 遷移してよければ true、遷移させたくなければ false を返す
   */
  public canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.isLogined) {
      // ログイン済・セッション設定ができているようなので遷移を許可する
      return true;
    }
    
    return this.loginService.autoReLogin()
      .then(() => {
        // 認証成功・対象の画面への遷移を許可する
        this.isLogined = true;
        return Promise.resolve(true);
      })
      .catch((error) => {
        console.warn('自動再ログイン試行 : 失敗・ログイン画面にリダイレクトする', error);
        this.isLogined = false;
        this.router.navigate(['/login']);
        return Promise.resolve(false);
      });
  }
}
