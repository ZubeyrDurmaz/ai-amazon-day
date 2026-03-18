import { Routes } from '@angular/router';
import { Registration } from './registration/registration';

export const routes: Routes = [
  { path: '', component: Registration },
  { path: '**', redirectTo: '' }
];
