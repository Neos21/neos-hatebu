import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // 未指定時は /home へのリダイレクトにしておき /home に設定した AuthGuard によって /login か /home に振り分けさせる
  { path: '', pathMatch: 'full', redirectTo: '/home' }
];

/**
 * App Routing
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
