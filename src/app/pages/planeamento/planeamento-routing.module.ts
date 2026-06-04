import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaneamentoPage } from './planeamento.page';

const routes: Routes = [
  {
    path: '',
    component: PlaneamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaneamentoPageRoutingModule {}
