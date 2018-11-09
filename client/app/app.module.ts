import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { PagesModule } from './pages/pages.module';

/**
 * App Module
 */
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    PagesModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
