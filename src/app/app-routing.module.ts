import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComplainComponent } from './component/complain/complain.component';
import { VerifyComplaintComponent } from './component/complain/verify-complaint/verify-complaint.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'quejas/listado',
        pathMatch: 'full'
      },
      {
        path: 'quejas',
        loadChildren: () => import('./demo/pages/tables/tbl-bootstrap/tbl-bootstrap.module').then(module => module.TblBootstrapModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'reporteria',
        loadChildren: () => import('./demo/pages/core-chart/core-chart.module').then(module => module.CoreChartModule),
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then(module => module.AuthenticationModule)
      }
    ]
  },
  {
    path: 'queja',
    component: ComplainComponent,
  },
  {
    path: 'verificar-queja',
    component: VerifyComplaintComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
