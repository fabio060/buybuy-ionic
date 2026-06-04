import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

export interface Produto {
  id: number;
  nome: string;
  precoOriginal: number;
  precoPromo: number;
  emPromocao: boolean;
  categoria: string;
  corredor: string;
  stock: string;
  imagem: string;
  quantidade?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ListaComprasService {
  private itensLista = new BehaviorSubject<Produto[]>([]);
  itens$ = this.itensLista.asObservable();
  
  private _storage: Storage | null = null;
  private storagePronto: Promise<void>; 

  public rotaRecalculada = false;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { 
    // Inicializa o storage e guarda a promessa
    this.storagePronto = this.initStorage();
  }

  /**
   * Inicializa o armazenamento local do Ionic Storage
   */
  async initStorage() {
    try {
      const storage = await this.storage.create();
      this._storage = storage;
      await this.carregarDadosGuardados();
    } catch (erro) {
      console.error('Erro ao inicializar o Ionic Storage:', erro);
    }
  }

  /**
   * Procura dados guardados no dispositivo e atualiza a lista ao iniciar
   */
  async carregarDadosGuardados() {
    if (!this._storage) return;
    const dadosGuardados = await this._storage.get('lista_compras');
    if (dadosGuardados) {
      this.itensLista.next(dadosGuardados);
    }
  }

  /**
   * Grava o estado atual da lista no armazenamento local
   */
  private async persistirNoStorage() {
    // Garante que o storage já foi criado antes de tentar gravar
    await this.storagePronto;
    if (this._storage) {
      await this._storage.set('lista_compras', this.itensLista.value);
    }
  }

  /**
   * Consome a lista de produtos globais a partir do ficheiro JSON local
   */
  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>('assets/data/produtos.json');
  }

  /**
   * Adiciona um produto à lista ou incrementa a sua quantidade caso já exista
   */
  adicionarProduto(produto: Produto) {
    const itensAtuais = this.itensLista.value;
    const itemExistente = itensAtuais.find(i => i.id === produto.id);

    if (itemExistente) {
      if (itemExistente.quantidade) itemExistente.quantidade++;
    } else {
      itensAtuais.push({ ...produto, quantidade: 1 });
    }

    this.itensLista.next([...itensAtuais]);
    this.persistirNoStorage();
  }

  /**
   * Remove um produto da lista ou decrementa a sua quantidade
   */
  removerProduto(produtoId: number) {
    const itensAtuais = this.itensLista.value;
    const itemExistente = itensAtuais.find((item: Produto) => item.id === produtoId);

    if (itemExistente) {
      if (itemExistente.quantidade && itemExistente.quantidade > 1) {
        itemExistente.quantidade -= 1;
        this.itensLista.next([...itensAtuais]);
      } else {
        const novaLista = itensAtuais.filter((item: Produto) => item.id !== produtoId);
        this.itensLista.next(novaLista);
      }
      this.persistirNoStorage();
    }
  }

  
  substituirProdutoEsgotado(idEsgotado: number, produtoNovo: Produto) {
    let itensAtuais = this.itensLista.value;

    // Remove o produto que se encontrava esgotado na prateleira
    itensAtuais = itensAtuais.filter(item => item.id !== idEsgotado);

    // Insere a sugestão alternativa aceitada pelo utilizador
    itensAtuais.push({ ...produtoNovo, quantidade: 1 });

    // Atualiza o BehaviorSubject reativo e grava no storage local
    this.itensLista.next([...itensAtuais]);
    this.persistirNoStorage();

    // Ativa a flag para que a aba de Mapa redesenhe o percurso em tempo real
    this.rotaRecalculada = true;
  }

  getSubtotal(): number {
    return this.itensLista.value.reduce((total, item) => {
      const preco = item.emPromocao ? item.precoPromo : item.precoOriginal;
      return total + (preco * (item.quantidade || 1));
    }, 0);
  }

  getContagemItens(): number {
    return this.itensLista.value.reduce((total, item) => total + (item.quantidade || 1), 0);
  }

  limparLista() {
    this.itensLista.next([]);
    this.rotaRecalculada = false; // Reinicia também o estado do mapa
    this.persistirNoStorage();
  }

  
  gerarListaViaHistorico() {
    const produtosHistorico: Produto[] = [
      {
        id: 991,
        nome: 'Leite Meio Gordo UHT 1L',
        precoOriginal: 0.99,
        precoPromo: 0.85,
        emPromocao: true,
        categoria: 'Laticínios',
        corredor: 'Corredor 3 (Laticínios)',
        stock: 'Disponível',
        imagem: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop&q=80',
        quantidade: 2
      },
      {
        id: 992,
        nome: 'Pão de Forma Integral 500g',
        precoOriginal: 1.59,
        precoPromo: 1.59,
        emPromocao: false,
        categoria: 'Padaria',
        corredor: 'Corredor 1 (Entrada / Padaria)',
        stock: 'Disponível',
        imagem: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=400&auto=format&fit=crop&q=80',
        quantidade: 1
      },
      {
        id: 993,
        nome: 'Arroz Agulha 1kg',
        precoOriginal: 1.25,
        precoPromo: 1.10,
        emPromocao: true,
        categoria: 'Mercearia',
        corredor: 'Corredor 5 (Mercearia)',
        stock: 'Disponível',
        imagem: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
        quantidade: 3
      }
    ];

    // Substitui a lista atual pelos produtos sugeridos pelo histórico
    this.itensLista.next(produtosHistorico);
    this.persistirNoStorage();
  }
}