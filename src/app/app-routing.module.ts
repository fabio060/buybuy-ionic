import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folheto',
    pathMatch: 'full'
  },
  {
    path: 'folheto',
    loadComponent: () => import('./pages/folheto/folheto.page').then(m => m.FolhetoPage)
  },
  {
    path: 'produtos',
    loadComponent: () => import('./pages/produtos/produtos.page').then(m => m.ProdutosPage)
  },
  {
    path: 'planeamento',
    loadComponent: () => import('./pages/planeamento/planeamento.page').then(m => m.PlaneamentoPage)
  },
  {
    path: 'mapa',
    loadComponent: () => import('./pages/mapa/mapa.page').then(m => m.MapaPage)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
