import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthSigninRoutingModule } from './auth-signin-routing.module';
import { AuthSigninComponent } from './auth-signin.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AuthSigninRoutingModule,
    FormsModule

  ],
  declarations: [AuthSigninComponent]
})
export class AuthSigninModule { }
