import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { NgUrlSettingRoutingModule } from './ng-url-setting-routing.module';
import { NgUrlSettingComponent } from './ng-url-setting/ng-url-setting.component';

/**
 * NG URL Setting Module
 */
@NgModule({
  imports: [
    SharedModule,
    NgUrlSettingRoutingModule
  ],
  declarations: [
    NgUrlSettingComponent
  ]
})
export class NgUrlSettingModule { }
