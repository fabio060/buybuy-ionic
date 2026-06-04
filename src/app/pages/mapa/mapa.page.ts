import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { documentTextOutline, cubeOutline, cartOutline, mapOutline, trashOutline } from 'ionicons/icons';

import { ListaComprasService, Produto } from '../../lista-compras.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class MapaPage implements OnInit {
  itensCarrinho: Produto[] = [];
  subtotal: number = 0;
  totalItens: number = 0;

  // [Cenário 3 - Difícil] Variável para controlar se o ecrã exibe a rota dinâmica recalculada
  isRotaNova: boolean = false;

  constructor(private listaService: ListaComprasService) {
    addIcons({ documentTextOutline, cubeOutline, cartOutline, mapOutline, trashOutline });
  }

  ngOnInit() {
    // Sincronizar com o serviço global da lista de compras
    this.listaService.itens$.subscribe((itens: Produto[]) => {
      this.itensCarrinho = itens;
      this.subtotal = this.listaService.getSubtotal();
      this.totalItens = this.listaService.getContagemItens();
    });
  }

  /**
   * Ciclo de vida do Ionic executado sempre que a página do mapa passa a estar ativa no ecrã.
   * Garante a verificação em tempo real do estado de recálculo da rota dinâmica.
   */
  ionViewWillEnter() {
    this.isRotaNova = this.listaService.rotaRecalculada;
  }

  /**
   * Função reativa que devolve 'true' se houver algum produto da lista no corredor indicado
   */
  temNoCorredor(nomeCorredor: string): boolean {
    return this.itensCarrinho.some(item => item.corredor === nomeCorredor);
  }

  removerDaLista(id: number) {
    this.listaService.removerProduto(id);
  }
}