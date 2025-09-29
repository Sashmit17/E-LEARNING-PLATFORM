import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './modules/landing/landing.component';
import { LoginComponentComponent } from './modules/authentication/login/login.component';
import { SignupComponent } from './modules/authentication/signup/signup.component';
import { instructorGuard } from './modules/authentication/auth/instructorauth.guard';
import { studentGuard } from './modules/authentication/auth/studentauth.guard';

const routes: Routes = [
  {path:'', component:LandingComponent},
  { path: 'instructor', loadChildren: () => import('./modules/instructor/instructor.module').then(m => m.InstructorModule), canActivate:[instructorGuard] },
  {path:'student', loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule), canActivate:[studentGuard]},    
  {path: 'login', component:LoginComponentComponent },
  { path:'signup', component:SignupComponent  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
