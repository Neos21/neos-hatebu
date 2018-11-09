import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../shared/guards/auth.guard';

import { NgDomainSettingComponent } from './ng-domain-setting/ng-domain-setting.component';

const routes: Routes = [
  { path: 'ng-domain-setting', component: NgDomainSettingComponent, canActivate: [AuthGuard]}
];

/**
 * NG Domain Setting Routing
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgDomainSettingRoutingModule { }
