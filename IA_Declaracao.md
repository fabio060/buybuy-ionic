# 📝 Diário de Desenvolvimento – Projeto BuyBuy

Este documento regista o progresso incremental, as atividades realizadas, os desafios encontrados e as decisões tomadas ao longo do desenvolvimento do protótipo interativo da aplicação **BuyBuy** em Ionic/Angular.

---

### 📅 Sessão 1 – Configuração da Arquitetura de Estado e Serviço Central
* **Objetivo:**
  * Criação da estrutura central de dados e do serviço Angular para gerir o carrinho/lista de compras de forma global.
* **Atividades realizadas:**
  * Criação do serviço centralizado `ListaComprasService`;
  * Definição da interface estrutural do objeto `Produto` (contendo propriedades cruciais como ID, nome, preço original, preço promocional, corredor, stock e imagem);
  * Implementação de métodos lógicos para controlo do carrinho: `adicionarProduto()`, `removerProduto()`, `limparLista()`, `getSubtotal()` e `getContagemItens()`.
* **Problemas:**
  * Ao navegar entre as páginas e abas da aplicação, os produtos inseridos no carrinho desaparecerciam, pois os dados locais das páginas eram reiniciados a cada mudança de rota.
* **Solução:**
  * Implementação de um fluxo de dados reativo utilizando `BehaviorSubject` (variável `itens$`) dentro do Service. Isto permitiu que qualquer alteração no carrinho fosse propagada e mantida em memória global durante toda a sessão de uso.
* **Decisões:**
  * Centralizar todos os cálculos matemáticos de conversão e somatório dentro do Service, aliviando a carga de processamento dos componentes visuais.

---

### 📅 Sessão 2 – Desenvolvimento do Folheto e Grelha Dinâmica
* **Objetivo:**
  * Implementação da página do Folheto de Promoções com renderização baseada no estado do Service.
* **Atividades realizadas:**
  * Desenho da interface da página do Folheto (`folheto.page.html`) recorrendo ao sistema de grelhas do Ionic (`ion-grid`, `ion-row`, `ion-col`);
  * Utilização da nova diretiva `@for` do Angular para iterar e gerar os cartões de produto (`ion-card`) dinamicamente;
  * Consumo dos dados do JSON através de um `.subscribe()`, aplicando um filtro para isolar e exibir estritamente os artigos que continham a propriedade `emPromocao: true`.
* **Problemas:**
  * Erro de cálculo visual na percentagem de desconto apresentada nos pequenos distintivos (*badges*) vermelhos de cada promoção.
* **Solução:**
  * Criação e acoplamento do método auxiliar `calcularDesconto(original, promo)` no ficheiro TypeScript para tratar matematicamente os valores e arredondá-los com `Math.round()`.
* **Decisões:**
  * Adicionar uma validação reativa no botão principal do cartão para que fique desativado (`[disabled]`) caso o stock do produto esteja marcado como "Esgotado", prevenindo erros de fluxo.

---

### 📅 Sessão 3 – Catálogo Geral de Produtos e Filtros Cruzados
* **Objetivo:**
  * Criação da página principal de produtos com sistemas de pesquisa textual e filtragem por categoria.
* **Atividades realizadas:**
  * Integração de botões circulares horizontais (`ion-button`) para alternar rapidamente entre categorias (Mercearia, Laticínios, Limpeza, etc.);
  * Inclusão da barra de pesquisa nativa `ion-searchbar` ligada ao evento `(ionInput)`;
  * Sincronização da barra lateral esquerda (`<aside>`) para monitorizar em tempo real as propriedades de subtotal e contagem total do carrinho.
* **Problemas:**
  * **Conflito/Bug de filtros anuláveis:** Quando o utilizador realizava uma pesquisa por texto e de seguida clicava num botão de categoria (ou vice-versa), o filtro anterior era completamente ignorado e apagado pela nova ação.
* **Solução:**
  * Desenvolvimento do método unificado `aplicarFiltros()`. Esta função passou a cruzar cumulativamente ambas as variáveis (`combinaCategoria && combinaPesquisa`) usando operações lógicas, garantindo que a pesquisa de texto se mantém ativa mesmo ao trocar de categoria.
* **Decisões:**
  * Adotar o suporte nativo a Dark Mode em toda a estrutura do layout através de cores hexadecimais escuras (`#121212`, `#1a1a1a`, `#222`) injetadas diretamente nos estilos inline.

---

### 📅 Sessão 4 – Heurísticas de Nielsen (Consistência e Finalização de Fluxo)
* **Objetivo:**
  * Alinhamento da interface com a **Heurística de Nielsen #4 (Consistência e Padrões)**, aplicando a mesma lógica de fecho de compra em todas as abas.
* **Atividades realizadas:**
  * Injeção do componente nativo `AlertController` nos ficheiros controladores de lógica (`folheto.page.ts` e `produtos.page.ts`);
  * Escrita da função assíncrona (`async/await`) `concluirCompra()` nas respetivas classes;
  * Mapeamento de cliques através do evento `(click)="concluirCompra()"` nos botões presentes no fundo do componente de carrinho lateral.
* **Problemas:**
  * O utilizador conseguia clicar no botão "Finalizar Compra" mesmo com a lista lateral vazia (sem produtos), o que gerava janelas de alerta sem nexo. Adicionalmente, detetou-se uma gralha ortográfica na interface de produtos (*"Finalizar Comra"*).
* **Solução:**
  * Retificação da gralha no HTML e introdução da propriedade condicional `[disabled]="itensCarrinho.length === 0"` no elemento do botão em ambas as páginas.
* **Decisões:**
  * Garantir que, após o utilizador clicar em "OK" na mensagem pop-up de sucesso, a função invoca obrigatoriamente o método `this.listaService.limparLista()`, limpando instantaneamente o ecrã e redefinindo o estado inicial do protótipo.

---

### 📅 Sessão 5 – Gestão da Rota de Compras (Página de Planeamento e Mapa)
* **Objetivo:**
  * Criação da lista estruturada e sequencial de compras e representação do espaço físico do supermercado.
* **Atividades realizadas:**
  * Integração da página de **Planeamento**, responsável por listar detalhadamente todos os produtos selecionados pelo utilizador;
  * Desenho da página do **Mapa**, contendo uma representação gráfica modular dos corredores do estabelecimento para servir de apoio visual à navegação em loja;
  * Configuração das diretivas `routerLink` e `routerLinkActive` no cabeçalho comum (`ion-header`) para permitir uma navegação fluida entre todas as quatro abas do projeto.
* **Problemas:**
  * A lista de compras na página de planeamento aparecia desorganizada, forçando o utilizador a andar para trás e para a frente no supermercado de forma aleatória.
* **Solução:**
  * Implementação de uma ordenação lógica com base na propriedade `corredor` de cada produto, agrupando os artigos para simular uma rota linear otimizada e sem retrocessos físicos na loja.
* **Decisões:**
  * Disponibilizar também na aba de Planeamento o mesmo botão de fecho com `concluirCompra()`, garantindo flexibilidade total para o utilizador encerrar o processo na página que preferir.

---

### 📅 Sessão 6 – Higienização de Dados Visuais e Submissão ao GitHub
* **Objetivo:**
  * Refinamento visual de alta fidelidade para a defesa do projeto e publicação do código fonte na plataforma de controlo de versões.
* **Atividades realizadas:**
  * Curadoria e higienização do array/JSON de produtos;
  * Inicialização do repositório Git local via terminal do VS Code, execução do primeiro commit estruturado (`git commit -m "feat: app buybuy concluida e consistente"`) e mapeamento da branch principal `main`;
  * Vinculação ao servidor remoto do GitHub e publicação final do código através do comando `git push`.
* **Problemas:**
  * Vários produtos cruciais do catálogo do supermercado (Azeite, Detergente, Arroz, Cereais e Leite) não apresentavam imagem na interface (ficavam em branco) por ausência de caminhos ou ficheiros válidos no código.
* **Solução:**
  * Substituição manual e mapeamento dos respetivos campos `"imagem"` por URLs públicos de alta resolução (provenientes do Unsplash) com enquadramento limpo e fundos neutros.
* **Decisões:**
  * Configurar e validar o ficheiro `.gitignore` nativo do projeto antes do upload para ignorar a pasta pesada `node_modules`, garantindo que o repositório entregue para avaliação fica limpo, leve e profissional.