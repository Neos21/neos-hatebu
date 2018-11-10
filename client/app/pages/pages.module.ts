import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { NgUrlSettingModule } from './ng-url-setting/ng-url-setting.module';
import { NgWordSettingModule } from './ng-word-setting/ng-word-setting.module';
import { NgDomainSettingModule } from './ng-domain-setting/ng-domain-setting.module';

/**
 * Pages Module
 */
@NgModule({
  imports: [
    SharedModule,
    LoginModule,
    HomeModule,
    NgUrlSettingModule,
    NgWordSettingModule,
    NgDomainSettingModule
  ]
})
export class PagesModule { }
