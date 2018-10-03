import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { AuthComponentComponent } from './auth-component/auth-component.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyAuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { CreateactivityComponent } from './createactivity/createactivity.component';
import { ShowactivityComponent } from './showactivity/showactivity.component';
import { HeaderComponent } from './header/header.component';
import { AgmCoreModule } from '@agm/core';
import { SpotService } from './services/spot.service';
import { SinglespotComponent } from './singlespot/singlespot.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { MyaccountComponent } from './myaccount/myaccount.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponentComponent },
  { path: 'authentification', component: AuthComponentComponent},
  { path: 'signup', component: SignUpComponent},
  { path: 'aboutus', component: AboutUsComponent},
  { path: 'createactivity', canActivate: [AuthGuardService], component: CreateactivityComponent},
  { path: 'showactivity', canActivate: [AuthGuardService], component: ShowactivityComponent},
  { path: 'myaccount', canActivate: [AuthGuardService], component: MyaccountComponent},
  { path: 'singlespot/:id', canActivate: [AuthGuardService], component: SinglespotComponent},
  { path: 'not-found', component: NotFoundComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // Mettre cela à la fin est nécessaire 
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponentComponent,
    AuthComponentComponent,
    NotFoundComponent,
    SignUpComponent,
    AboutUsComponent,
    CreateactivityComponent,
    ShowactivityComponent,
    HeaderComponent,
    SinglespotComponent,
    MyaccountComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCLbdTLUH4Bjck5jF9oruVdMEd9eOeDW14',
      libraries: ['places']
    }),
    AgmJsMarkerClustererModule,
  ],
  providers: [
    MyAuthService,
    AuthGuardService,
    SpotService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
