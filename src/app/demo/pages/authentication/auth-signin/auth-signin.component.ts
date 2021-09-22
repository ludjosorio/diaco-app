import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {

  public email: string = '';
  public password: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async doLogin() {
    try {
      const { data } = await this.api.post('/auth', { email: this.email, password: this.password });
      window.localStorage.setItem('auth', JSON.stringify(data));
      this.router.navigateByUrl('/quejas/listado');
    } catch (error) {
      alert(error.message || 'Ocurrió un error al validar la sesión, por favor intente nuevamente');
    }
  }

}
