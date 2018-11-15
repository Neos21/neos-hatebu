import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

/**
 * クッキーによるセッション管理とリクエストタイムアウトを有効にするための HttpClient インターセプタ
 */
@Injectable({
  providedIn: 'root'
})
export class CustomInterceptor implements HttpInterceptor {
  /**
   * クッキーによるセッション管理とリクエストタイムアウトを有効にする
   * 
   * @param request リクエスト
   * @param next ハンドラ
   * @return HttpEvent の Observable
   */
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // tslint:disable-next-line
    request = request.clone({
      withCredentials: true
    });
    
    return next.handle(request).pipe(timeout(40000));  // 40秒でタイムアウトにする (Heroku は30秒以上レスポンスを返さないとタイムアウトされるのでその分は待つ)
  }
}
