import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { UsersComponent } from './components/users/users.component';

/**
 * Rutas principales de la aplicación
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'welcome',
    component: LayoutComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      }
    ]
  },
];

/**
 * Modulo encargado de administrar las rutas de la aplicación
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule { }
