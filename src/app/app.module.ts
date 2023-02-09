import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './material-module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';

import { HomeComponent } from './_components/home/home.component';
import { LoginComponent } from './_components/login/login.component';
import { MenuComponent } from './_components/menus/menu/menu.component';
import { RestorePasswordComponent } from './_components/restore-password/restore-password.component';
import { NavbarComponent } from './_components/menus/navbar/navbar.component'
import { AccountVerifyComponent } from './_components/account-verify/account-verify.component';
import { FilterPipe } from './_helpers/filter.pipe';
import { ChartsComponent } from './_components/charts/charts.component';
import { SignalsComponent } from './_components/signals/signals.component';
import { ControlpanelComponent } from './_components/controlpanel/controlpanel.component';
import { NgxEchartsModule } from 'ngx-echarts';;
import { SensorsComponent } from './_components/sensors/sensors.component';
import { ReportsComponent } from './_components/reports/reports.component';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ReportFiltersComponent } from './_components/report-filters/report-filters.component';
import { ReportListingComponent } from './_components/report-listing/report-listing.component';
import { ReportChartComponent } from './_components/report-chart/report-chart.component';
import { NgxSpinnerModule } from "ngx-spinner";;
import { AlertAlarmComponent, DialogOverviewExampleDialog } from './_components/alert-alarm/alert-alarm.component';
import {MatDialogModule} from '@angular/material/dialog';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
/*
import { NgxSpinnerModule } from "ngx-spinner";
*/
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    NgSelectModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    DateTimePickerModule,
    DateInputsModule,
    NgxSpinnerModule,
    MatDialogModule,
    UiSwitchModule,
    MatPaginatorModule,
    NgxPaginationModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MenuComponent,
    RestorePasswordComponent,
    AccountVerifyComponent,
    ChartsComponent,
    FilterPipe,
    NavbarComponent,
    SignalsComponent,
    ControlpanelComponent,
    SensorsComponent,
    ReportsComponent,
    ReportFiltersComponent,
    ReportListingComponent,
    AlertAlarmComponent,
    DialogOverviewExampleDialog,
    ReportChartComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
