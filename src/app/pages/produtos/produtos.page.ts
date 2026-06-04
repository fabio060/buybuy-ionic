import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular'; // Adicionado AlertController
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { documentTextOutline, cubeOutline, cartOutline, mapOutline, trashOutline } from 'ionicons/icons';

import { ListaComprasService, Produto } from '../../lista-compras.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class ProdutosPage implements OnInit {
  todosProdutos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  categoriaSelecionada: string = 'Todos';
  termoPesquisa: string = '';

  // Dados sincronizados da Lista de Compras
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
    // 1. Carregar TODOS os produtos sem exceção do JSON
    this.listaService.getProdutos().subscribe({
      next: (dados: Produto[]) => {
        this.todosProdutos = dados;
        this.produtosFiltrados = dados; // Inicialmente mostra todos
      },
      error: (err) => console.error(err)
    });

    // 2. Subscrever às alterações da lista lateral
    this.listaService.itens$.subscribe((itens: Produto[]) => {
      this.itensCarrinho = itens;
      this.subtotal = this.listaService.getSubtotal();
      this.totalItens = this.listaService.getContagemItens();
    });
  }

  /**
   * Função que roda quando clicas nos botões de categoria
   */
  filtrarCategoria(categoria: string) {
    this.categoriaSelecionada = categoria;
    this.aplicarFiltros(); // Usa a função centralizada para combinar categoria + pesquisa
  }

  /**
   * Filtra os produtos com base no que o utilizador escreve na barra de pesquisa
   */
  filtrarPorPesquisa(event: any) {
    this.termoPesquisa = event.target.value ? event.target.value.toLowerCase() : '';
    this.aplicarFiltros();
  }

  /**
   * Aplica de forma combinada e cruzada os filtros de Categoria e de Pesquisa Textual
   */
  aplicarFiltros() {
    this.produtosFiltrados = this.todosProdutos.filter(produto => {
      const combinaCategoria = this.categoriaSelecionada === 'Todos' || produto.categoria === this.categoriaSelecionada;
      const combinaPesquisa = produto.nome.toLowerCase().includes(this.termoPesquisa);
      return combinaCategoria && combinaPesquisa;
    });
  }

  adicionarA_Lista(produto: Produto) {
    this.listaService.adicionarProduto(produto);
  }

  removerDaLista(id: number) {
    this.listaService.removerProduto(id);
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