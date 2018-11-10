import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../shared/guards/auth.guard';

import { NgUrlSettingComponent } from './ng-url-setting/ng-url-setting.component';

const routes: Routes = [
  { path: 'ng-url-setting', component: NgUrlSettingComponent, canActivate: [AuthGuard]}
];

/**
 * NG URL Setting Routing
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgUrlSettingRoutingModule { }
