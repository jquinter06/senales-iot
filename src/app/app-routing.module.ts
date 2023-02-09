import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './_components/home/home.component';
import { LoginComponent } from './_components/login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { RestorePasswordComponent } from './_components/restore-password/restore-password.component';
import { ChartsComponent } from './_components/charts/charts.component';
import { ControlpanelComponent } from './_components/controlpanel/controlpanel.component';
import { SensorsComponent } from './_components/sensors/sensors.component';
import { ReportsComponent } from './_components/reports/reports.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'restore', component: RestorePasswordComponent },
  { path: 'charts/:id', component: ChartsComponent, canActivate: [AuthGuard] },
  { path: 'panel', component: ControlpanelComponent, canActivate: [AuthGuard] },
  { path: 'sensors', component: SensorsComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
