import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { documentTextOutline, cubeOutline, trashOutline, cartOutline, mapOutline, personOutline, timeOutline, shareSocialOutline } from 'ionicons/icons';
import { ScreenOrientation } from '@capacitor/screen-orientation'; // Importação para controlo de hardware

// Importa o serviço que está solto na pasta app
import { ListaComprasService, Produto } from './lista-compras.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class AppComponent implements OnInit {
  itensCarrinho: Produto[] = [];
  subtotal: number = 0;
  totalItens: number = 0;

  constructor(private listaService: ListaComprasService) {
    // Registo centralizado de todos os ícones necessários no projeto (Requisito #6)
    addIcons({ 
      documentTextOutline, 
      cubeOutline, 
      trashOutline, 
      cartOutline, 
      mapOutline,
      personOutline,
      timeOutline,
      shareSocialOutline
    });
  }

  ngOnInit() {
    // 1. Bloquear a orientação do ecrã em modo Retrato/Vertical (Requisito #12)
    this.trancarOrientacaoDispositivo();

    // 2. Subscrever em tempo real às atualizações da lista de compras (Requisito #15)
    this.listaService.itens$.subscribe((itens: Produto[]) => {
      this.itensCarrinho = itens;
      this.subtotal = this.listaService.getSubtotal();
      this.totalItens = this.listaService.getContagemItens();
    });
  }

  /**
   * Bloqueia o ecrã do dispositivo em modo portrait usando o Capacitor (Requisito #12)
   * Impede a visualização em landscape através da manipulação do acelerómetro.
   */
  async trancarOrientacaoDispositivo() {
    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
      console.log('Capacitor: Orientação trancada em Portrait vertical.');
    } catch (erro) {
      // Evita o fecho abrupto da aplicação quando testada num ambiente Web/Browser comum
      console.warn('Capacitor: Detetado ambiente Web browser, o bloqueio físico foi ignorado.', erro);
    }
  }

  /**
   * Encaminha a ação de remoção de um artigo para o serviço centralizado
   */
  removerDaLista(produtoId: number) {
    this.listaService.removerProduto(produtoId);
  }
}