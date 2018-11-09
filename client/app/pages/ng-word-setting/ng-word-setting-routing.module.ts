import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../shared/guards/auth.guard';

import { NgWordSettingComponent } from './ng-word-setting/ng-word-setting.component';

const routes: Routes = [
  { path: 'ng-word-setting', component: NgWordSettingComponent, canActivate: [AuthGuard] }
];

/**
 * NG Word Setting Routing
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgWordSettingRoutingModule { }
