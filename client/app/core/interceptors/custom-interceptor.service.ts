import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

/**
 * クッキーによるセッション管理を有効にするための HttpClient インターセプタ
 */
@Injectable({
  providedIn: 'root'
})
export class CustomInterceptor implements HttpInterceptor {
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // tslint:disable-next-line
    request = request.clone({
      withCredentials: true
    });
    
    return next.handle(request);
  }
}
