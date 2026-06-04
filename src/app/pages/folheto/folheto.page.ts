import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular'; // Adicionado AlertController
import { RouterModule } from '@angular/router'; // Ativa o suporte para as rotas e routerLink
import { addIcons } from 'ionicons';
import { documentTextOutline, cubeOutline, cartOutline, mapOutline, trashOutline } from 'ionicons/icons';

import { ListaComprasService, Produto } from '../../lista-compras.service';

@Component({
  selector: 'app-folheto',
  templateUrl: './folheto.page.html',
  styleUrls: ['./folheto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule] // Incluído o RouterModule aqui
})
export class FolhetoPage implements OnInit {
  produtosEmPromo: Produto[] = [];
  
  // Variáveis para gerir a lista de compras localmente nesta vista
  itensCarrinho: Produto[] = [];
  subtotal: number = 0;
  totalItens: number = 0;

  constructor(
    private listaService: ListaComprasService,
    private alertController: AlertController // Injetar o AlertController do Ionic (Heurística de Nielsen #1)
  ) {
    addIcons({ documentTextOutline, cubeOutline, cartOutline, mapOutline, trashOutline });
  }

  ngOnInit() {
    // 1. Carregar produtos do JSON
    this.listaService.getProdutos().subscribe({
      next: (dados: Produto[]) => {
        this.produtosEmPromo = dados.filter(p => p.emPromocao);
      },
      error: (err) => console.error(err)
    });

    // 2. Escutar atualizações da lista de compras em tempo real
    this.listaService.itens$.subscribe((itens: Produto[]) => {
      this.itensCarrinho = itens;
      this.subtotal = this.listaService.getSubtotal();
      this.totalItens = this.listaService.getContagemItens();
    });
  }

  adicionarA_Lista(produto: Produto) {
    this.listaService.adicionarProduto(produto);
  }

  removerDaLista(id: number) {
    this.listaService.removerProduto(id);
  }

  calcularDesconto(original: number, promo: number): number {
    if (!original || !promo) return 0;
    return Math.round(((original - promo) / original) * 100);
  }

  /**
   * AÇÃO DO BOTÃO FINALIZAR: Conclui o fluxo da tarefa e exibe uma janela pop-up de sucesso
   */
  async concluirCompra() {
    const alert = await this.alertController.create({
      header: 'Compra Finalizada!',
      message: 'A sua rota de compras foi guardada com sucesso no dispositivo. Obrigado por usar o BuyBuy!',
      buttons: ['OK']
    });

    await alert.present();
    this.listaService.limparLista(); // Esvazia o carrinho e limpa o ecrã após o sucesso
  }
}