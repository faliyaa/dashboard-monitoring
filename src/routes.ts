import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/Register';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
  },
  {
    path: '/login',
    component: lazy(() => import('./pages/Login')),
  },
  {
    path: '/dashboard',
    component: lazy(() => import('./pages/Dashboard')),
  },
  {
    path: '/bloodtypechart',
    component: lazy(() => import('./pages/BloodTypeChart')),
  },
  {
    path: '/agechart',
    component: lazy(() => import('./pages/AgeChart')),
  },
  {
    path: '/incomechart',
    component: lazy(() => import('./pages/IncomeChart')),
  },
  {
    path: '/grid',
    component: lazy(() => import('./pages/DataGrid')),
  },
  {
    path: '/adduser',
    component: lazy(() => import('./pages/AddUserForm')),
  },
  {
    path: '/users/edit/:id',  // Perbaiki rute ini untuk menerima parameter email
    component: lazy(() => import('./pages/EditForm')),
  },
  {
    path: '/sidebar',
    component: lazy(() => import('./pages/Sidebar')),
  },
  {
    path: '/navbar',
    component: lazy(() => import('./pages/Navbar')),
  },
  {
    path: '/resetpassword',
    component: lazy(() => import('./pages/LupaPassword')),
  },
  {
    path: '/verifikasiotp',
    component: lazy(() => import('./pages/VerifikasiOtp')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
