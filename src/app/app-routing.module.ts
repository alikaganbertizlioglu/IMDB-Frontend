import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MovieComponent } from './components/movie/movie.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'login',component:LoginComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'movie/:id', component: MovieComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
