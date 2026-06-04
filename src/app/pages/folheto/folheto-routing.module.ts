import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolhetoPage } from './folheto.page';

const routes: Routes = [
  {
    path: '',
    component: FolhetoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolhetoPageRoutingModule {}
