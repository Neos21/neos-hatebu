import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { NgWordSettingRoutingModule } from './ng-word-setting-routing.module';
import { NgWordSettingComponent } from './ng-word-setting/ng-word-setting.component';

/**
 * NG Word Setting Module
 */
@NgModule({
  imports: [
    SharedModule,
    NgWordSettingRoutingModule
  ],
  declarations: [
    NgWordSettingComponent
  ]
})
export class NgWordSettingModule { }
