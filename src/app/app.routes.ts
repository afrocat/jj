import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'stores',
    loadComponent: () => import('./components/stores/store-list/store-list.component').then(m => m.StoreListComponent)
  },
  {
    path: 'stores/:id',
    loadComponent: () => import('./components/stores/store-detail/store-detail.component').then(m => m.StoreDetailComponent)
  },
  {
    path: 'stocks',
    loadComponent: () => import('./components/stocks/stock-list/stock-list.component').then(m => m.StockListComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./components/products/product-list/product-list.component').then(m => m.ProductListComponent)
  }
];