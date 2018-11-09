import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { NgDomainSettingRoutingModule } from './ng-domain-setting-routing.module';
import { NgDomainSettingComponent } from './ng-domain-setting/ng-domain-setting.component';

/**
 * NG Domain Setting Module
 */
@NgModule({
  imports: [
    SharedModule,
    NgDomainSettingRoutingModule
  ],
  declarations: [
    NgDomainSettingComponent
  ]
})
export class NgDomainSettingModule { }
