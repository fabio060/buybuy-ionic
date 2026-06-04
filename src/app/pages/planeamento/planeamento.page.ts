import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { documentTextOutline, cubeOutline, cartOutline, mapOutline, trashOutline, timeOutline, shareSocialOutline, personOutline } from 'ionicons/icons';

import { ListaComprasService, Produto } from '../../lista-compras.service';

@Component({
  selector: 'app-planeamento',
  templateUrl: './planeamento.page.html',
  styleUrls: ['./planeamento.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class PlaneamentoPage implements OnInit {
  itensCarrinho: Produto[] = [];
  subtotal: number = 0;
  totalItens: number = 0;

  // Lista de strings com os nomes únicos dos corredores que têm artigos
  corredoresComItens: string[] = [];

  // [Cenário 3 - Difícil] Variáveis para controlo da sugestão alternativa
  produtoSugerido: Produto | null = null;
  idProdutoEsgotado: number | null = null;

  constructor(
    private listaService: ListaComprasService,
    private alertController: AlertController
  ) {
    // Registo de todos os ícones necessários para o cabeçalho e para os botões de ação
    addIcons({ 
      documentTextOutline, 
      cubeOutline, 
      cartOutline, 
      mapOutline, 
      trashOutline, 
      timeOutline, 
      shareSocialOutline, 
      personOutline 
    });
  }

  ngOnInit() {
    // Escutar a lista de compras em tempo real
    this.listaService.itens$.subscribe((itens: Produto[]) => {
      this.itensCarrinho = itens;
      this.subtotal = this.listaService.getSubtotal();
      this.totalItens = this.listaService.getContagemItens();

      // Processa e extrai quais corredores estão ativos e ordena-os (Corredor 1, Corredor 2, etc.)
      this.gerarPlanoDeRota();
    });
  }

  /**
   * Analisa os itens no carrinho, extrai os corredores sem repetições e ordena-os.
   * Cria o caminho ideal de recolha sem retrocessos no supermercado.
   */
  gerarPlanoDeRota() {
    // Mapeia todos os corredores dos produtos adicionados
    const todosCorredores = this.itensCarrinho.map(item => item.corredor);
    
    // Remove duplicados para ter apenas corredores únicos e ordena-os de forma ascendente
    this.corredoresComItens = [...new Set(todosCorredores)].sort((a, b) => a.localeCompare(b));
  }

  /**
   * Filtra e devolve apenas os produtos que pertencem a um determinado corredor
   */
  getProdutosPorCorredor(corredor: string): Produto[] {
    return this.itensCarrinho.filter(item => item.corredor === corredor);
  }

  /**
   * Remove um artigo da lista através do clique no botão do lixo
   */
  removerDaLista(id: number) {
    this.listaService.removerProduto(id);
  }

  /**
   * [Cenário 3 - Difícil] Simula o algoritmo de sugestões alternativas quando um artigo está esgotado
   */
  procurarAlternativa(produtoEsgotado: Produto) {
    this.idProdutoEsgotado = produtoEsgotado.id;

    // Gera um produto alternativo equivalente baseado no que está em falta na prateleira
    this.produtoSugerido = {
      id: Math.floor(Math.random() * 1000) + 500, // ID aleatório temporário para evitar colisões
      nome: `${produtoEsgotado.nome} (Marca Alternativa)`,
      categoria: produtoEsgotado.categoria,
      precoOriginal: Number((produtoEsgotado.precoOriginal * 0.85).toFixed(2)), // Simula ser ligeiramente mais barato
      precoPromo: Number((produtoEsgotado.precoOriginal * 0.85).toFixed(2)),
      emPromocao: false,
      corredor: 'Corredor 5 (Alternativas Dinâmicas)', // Altera propositadamente o corredor para forçar o recálculo do mapa
      stock: 'Disponível',
      imagem: produtoEsgotado.imagem
    };
  }

  /**
   * [Cenário 3 - Difícil] Confirma a substituição do produto no serviço e limpa a janela de sugestão
   */
  confirmarSubstituicao() {
    if (this.idProdutoEsgotado && this.produtoSugerido) {
      this.listaService.substituirProdutoEsgotado(this.idProdutoEsgotado, this.produtoSugerido);
      
      // Limpa os estados de simulação locais
      this.produtoSugerido = null;
      this.idProdutoEsgotado = null;
    }
  }

  /**
   * AÇÃO DO BOTÃO 1: Aciona a simulação de histórico do serviço para preencher o ecrã
   */
  gerarDoHistorico() {
    this.listaService.gerarListaViaHistorico();
  }

  /**
   * AÇÃO DO BOTÃO 2: Conclui o fluxo da tarefa e exibe uma janela pop-up de sucesso
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