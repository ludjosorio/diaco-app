import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {

  public username = '';

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    const user = JSON.parse(window.localStorage.getItem('auth'));
    this.username = user?.name;
  }

  logout() {
    window.localStorage.removeItem('auth');
    this.router.navigateByUrl('auth/signin');
  }

}
