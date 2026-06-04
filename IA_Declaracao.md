# 📝 Diário de Desenvolvimento – Projeto BuyBuy

**Unidade Curricular:** IHM  
**Grupo / Autores:** * **Fábio Esteves**   
* **Simão Gigante**   

---

### 📅 Sessão 1 – Configuração da Arquitetura de Estado e Serviço Central
* **Objetivo:**
  * Criação da estrutura central de dados e do serviço Angular para gerir o carrinho/lista de compras de forma global.
* **Distribuição de Trabalho:**
  * **Simão:** Desenhou a interface estrutural do objeto `Produto` (ID, nome, preço, corredor, stock e imagem) e escreveu a lógica base dos métodos `adicionarProduto()` e `removerProduto()`.
  * **Fábio:** Identificou o problema da perda de dados na navegação, implementou o fluxo reativo com o `BehaviorSubject` (`itens$`) no Service e centralizou os métodos matemáticos de cálculo do `getSubtotal()` e `getContagemItens()`.
* **Problemas:**
  * Ao navegar entre as páginas e abas da aplicação, os produtos inseridos no carrinho desapareceriam, pois os dados locais das páginas eram reiniciados a cada mudança de rota.
* **Solução:**
  * Implementação de um fluxo de dados reativo utilizando `BehaviorSubject` (variável `itens$`) dentro do Service. Isto permitiu que qualquer alteração no carrinho fosse propagada e mantida em memória global durante toda a sessão de uso.
* **Decisões:**
  * Centralizar todos os cálculos matemáticos de conversão e somatório dentro do Service, aliviando a carga de processamento dos componentes visuais.

---

### 📅 Sessão 2 – Desenvolvimento do Folheto e Grelha Dinâmica
* **Objetivo:**
  * Implementação da página do Folheto de Promoções com renderização baseada no estado do Service.
* **Distribuição de Trabalho:**
  * **Fábio:** Desenhou o esqueleto do layout no HTML do Folheto (`folheto.page.html`) estruturando com o sistema de grelhas do Ionic (`ion-grid`, `ion-row`, `ion-col`).
  * **Simão:** Aplicou a nova diretiva `@for` do Angular para a renderização dinâmica dos cartões, fez o `.subscribe()` para filtrar apenas os produtos com `emPromocao: true` e implementou a função matemática `calcularDesconto()`.
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
* **Distribuição de Trabalho:**
  * **Simão:** Desenhou a barra de botões horizontais para alternar entre as categorias e integrou a estrutura visual do painel lateral esquerdo (`<aside>`) para monitorizar o subtotal.
  * **Fábio:** Configurou o componente `ion-searchbar` com o evento `(ionInput)` e programou o algoritmo complexo do método unificado `aplicarFiltros()` para cruzar cumulativamente o texto pesquisado e a categoria ativa.
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
* **Distribuição de Trabalho:**
  * **Fábio:** Fez a auditoria das heurísticas e detetou a falha de validação que permitia finalizar carrinhos vazios, bem como a gralha ortográfica *"Finalizar Comra"*, corrigindo-as no HTML com o atributo `[disabled]`.
  * **Simão:** Importou e injetou o `AlertController` do Ionic nos controladores TypeScript do folheto e produtos, configurando a janela assíncrona (`async/await`) `concluirCompra()` e interligando-a com o reset do serviço global.
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
* **Distribuição de Trabalho:**
  * **Simão:** Desenhou a componente visual do Mapa do Supermercado destacando os blocos dos corredores a cores consoante o estado, e interligou o menu do cabeçalho global com as diretivas `routerLink` e `routerLinkActive`.
  * **Fábio:** Desenvolveu a lógica da página de Planeamento, programando o método de agrupamento e ordenação alfabética `gerarPlanoDeRota()` baseado em `Set` e `sort()` para evitar que o utilizador fizesse retrocessos na loja.
* **Problemas:**
  * A lista de compras na página de planeamento aparecia desorganizada, forçando o utilizador a andar para trás e para a frente no supermercado de forma aleatória.
* **Solução:**
  * Implementação de uma ordenação lógica com base na propriedade `corredor` de cada produto, agrupando os artigos para simular uma rota linear otimizada e sem retrocessos físicos na loja.
* **Decisões:**
  * Disponibilizar também na aba de Planeamento o mesmo botão de fecho com `concluirCompra()`, garantindo flexibilidade total para o utilizador encerrar o processo na página que preferir.

---

### 📅 Sessão 6 – Higienização de Dados Visuais e Submissão Colaborativa ao GitHub
* **Objetivo:**
  * Refinamento visual de alta fidelidade para a defesa do projeto e publicação conjunta do código-fonte na plataforma de controlo de versões.
* **Distribuição de Trabalho:**
  * **Fábio:** Realizou a curadoria do catálogo de produtos em JSON, tratando de recolher e embutir os links de imagem de alta resolução do Unsplash para remover as caixas em branco da interface.
  * **Simão:** Criou o repositório no GitHub, configurou o ficheiro `.gitignore` para omitir os pacotes locais pesados, adicionou o Fábio como colaborador do repositório remoto e efetuou os comandos finais de push da branch `main`.
* **Problemas:**
  * Vários produtos cruciais do catálogo do supermercado (Azeite, Detergente, Arroz, Cereais e Leite) não apresentavam imagem na interface (ficavam em branco) por ausência de caminhos ou ficheiros válidos no código.
* **Solução:**
  * Substituição manual e mapeamento dos respetivos campos `"imagem"` por URLs públicos de alta resolução (provenientes do Unsplash) com enquadramento limpo e fundos neutros.
* **Decisões:**
  * Configurar e validar o ficheiro `.gitignore` nativo do projeto antes do upload para ignorar a pasta pesada `node_modules`, garantindo que o repositório entregue para avaliação fica limpo, leve e profissional, permitindo que ambos os elementos do grupo consigam clonar e trabalhar no código sem conflitos de dependências.