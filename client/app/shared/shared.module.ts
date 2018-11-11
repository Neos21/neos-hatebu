import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HatebuUrlPipe } from './pipes/hatebu-url.pipe';

/**
 * Shared Module
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [
    HatebuUrlPipe
  ],
  exports: [
    // Re-Export
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Pipes
    HatebuUrlPipe
  ]
})
export class SharedModule { }
