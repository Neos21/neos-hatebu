import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CustomInterceptor } from './interceptors/custom.interceptor';

/**
 * Core Module
 * 
 * SharedModule を import せず独立させる
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    // クッキーによるセッション管理を有効にする
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { }
