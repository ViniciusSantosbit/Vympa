# VYMPA Landing

S00 a S07 implementados e validados localmente. S08 a S13 não iniciados. Premissas S06 pendentes de aprovação para publicação. Projeto criado diretamente na pasta Vympa, inicialmente vazia, pelo template oficial React/TypeScript do Vite.

## Ambiente e instalação

Windows / PowerShell. Node 24.22.1 e npm 11.19.1 usados na preparação. Requer Node 22.12+ ou 24+ compatível com Vite 8. Versões exatas estão em package-lock.json.

```powershell
cd C:\Users\vinicius.santos\Desktop\Vympa
code .
npm ci
npm run dev
```

Servidor local: http://127.0.0.1:5173 (Vite informa outra porta se ocupada).

## Verificações

```powershell
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run preview
```

Use npm run format para formatar. Build em dist/. Não há publicação ou remoto configurado por esta etapa.

## Arquitetura

- public/images e public/icons: recursos estáticos futuros.
- src/app: App e providers globais.
- src/components/{common,layout,ui}: componentes reutilizáveis.
- src/sections/{Navbar,Hero,Plans,Results,Team,Footer}: seções futuras, sem implementação.
- src/features/segment-selection: contexto e hook useSegment.
- src/content: segmentos, planos, clientes, simulacao, equipe e contatos tipados.
- src/types/content.ts: contratos compartilhados.
- src/styles: globals.css e tokens.css, com tema Tailwind v4.
- src/{assets,hooks,lib} e tests: reservados para etapas futuras.

Alias @/ aponta para src no Vite e TypeScript. Tailwind usa @tailwindcss/vite e @import 'tailwindcss', sem configuração legada. TypeScript strict, noUncheckedIndexedAccess e exactOptionalPropertyTypes estão ativos.

## Contrato para S01

SegmentId: advocacia | contabilidade | imobiliarias. SegmentProvider envolve toda a aplicação. useSegment retorna selectedSegment (inicial null = visão geral) e setSelectedSegment, aceitando SegmentId ou null. src/content/segmentos.ts mantém IDs estáveis. Navbar e seletor visual ainda não implementados; rolagem e animações são futuras.

## Conteúdo pendente

Documentos de Estrutura e Prompt-mestre não estavam na pasta. Textos de apoio e referências visuais dos segmentos foram fornecidos e integrados no S02. Contexto WhatsApp, descrições dos serviços, entregas e chamadas de contato aguardam aprovação. Clientes e equipe são listas vazias; contatos e simulação usam null onde faltam dados. Não há preços, clientes, resultados ou contatos inventados.

Nunca inserir segredos em variáveis VITE_. .env.example contém somente orientação pública. Consulte AGENTS.md antes das próximas etapas.

## Registro de validação S00

Versões verificadas: React/React DOM 19.3.1, Vite 8.3.5, plugin React 6.2.1, TypeScript 6.0.3, Tailwind 4.3.4, ESLint 10.14.0, typescript-eslint 8.72.1 e Prettier 3.9.10. O template utilizava TypeScript 7 e Oxlint; foram ajustados para a faixa suportada pelo typescript-eslint e para o ESLint solicitado.

Typecheck, ESLint, formatação e build foram executados com sucesso. Navegador validado em 1440×900 e 390×844: sem mensagens de erro/aviso no console, sem transbordamento horizontal, estado inicial Visão geral e utilitários Tailwind confirmados por estilos computados (display flex e marca rgb(0, 167, 236)).

Auditoria: zero vulnerabilidades em produção (npm audit --omit=dev). A auditoria completa apontou 13 ocorrências moderadas na cadeia de desenvolvimento do ESLint, originadas em minimatch <11.0.1 (GHSA-g3hv-75wg-m249). As versões atuais das ferramentas requerem minimatch 10; não foi imposta uma troca de versão principal fora do contrato dos mantenedores. Acompanhar atualização oficial. Não afeta o bundle de produção.

Git inicializado localmente, sem commit e sem remoto. .gitignore verificado para node_modules, dist, ambientes e chaves. A primeira tentativa de npm ci encontrou bloqueio de arquivo nativo pelo servidor Vite no Windows; o servidor foi encerrado para repetir a instalação.

## S01 — Navbar e seleção de segmentos

Implementados Navbar.tsx, SegmentSelector.tsx, MobileMenu.tsx, InstitutionalNavigation.tsx e navbar.css em src/sections/Navbar. App compõe a navbar sobre a tela de verificação S00. Header fixo com 84px no desktop e 72px no modo compacto (<1100px); transparente no topo, fundo discreto e blur após 24px de rolagem. A variável --navbar-height define o recuo do conteúdo e scroll-margin.

A logo oficial está em public/images/vympa-logo.png, preservada sem edição. O símbolo é acompanhado pelo texto VYMPA; margens transparentes são acomodadas por enquadramento CSS. public/images/hero-escritorio-juridico.png foi copiada sem edição e não é carregada nesta etapa. Não foi fornecida uma referência específica da navbar; composição segue as especificações textuais do S01. Fidelidade exata à referência não pôde ser comparada.

SegmentSelector usa useSegment com aria-pressed e IDs estáveis. O estado inicial continua null. Seleção não altera URL nem aciona rolagem automática. Links institucionais são textos aria-disabled, identificados como disponíveis em breve. Logo retorna a #inicio; há atalho de teclado para o conteúdo.

Menu mobile usa dialog nativo, aria-expanded/controls, Escape, clique externo, fechamento após seleção, contenção explícita de Tab/Shift+Tab, retorno de foco ao acionador e bloqueio de rolagem de fundo. Fecha ao passar ao desktop. Transições de entrada/saída respeitam prefers-reduced-motion; navegadores sem transição discreta mantêm abertura/fechamento funcional.

Validações S01: typecheck, lint, format:check e build; navegador em 1600×900, 1440×900 e 390×844; alternância dos três segmentos, Enter/Espaço, Escape, ciclo de foco, retorno ao acionador, menu mobile sem transbordamento. Rolagem validada com viewport reduzido em altura, sem adicionar seções fictícias. prefers-reduced-motion foi verificado nas regras CSS; emulação da preferência não disponível no navegador de testes. Hero e serviços permanecem fora do escopo; integração visual sobre fotografia fica para S02. Sem novas dependências ou publicação.

## S02 — Hero e transições por segmento

Hero integrada em substituição à tela técnica do S00. Navbar aprovada preservada, com remoção apenas do padding de conteúdo que impedia a fotografia de alcançar o topo. O recuo da navbar está agora no shell da hero. Título e descrição da página atualizados no index.html.

Arquivos criados: src/content/hero.ts; src/sections/Hero/Hero.tsx, HeroBackground.tsx, HeroActions.tsx e hero.css; public/images/hero-escritorio-juridico.webp. Modificados: src/content/segmentos.ts, src/app/App.tsx, src/styles/tokens.css, src/styles/globals.css (remoção dos estilos da tela técnica), src/sections/Navbar/navbar.css, index.html, AGENTS.md e este README.

A fotografia limpa original foi preservada. WebP de 1647×955 e 122.844 bytes, gerado em qualidade 92, contra 1.566.713 bytes do PNG (redução aproximada de 92%). Pillow foi usado somente como ferramenta temporária, sem novas dependências da aplicação. picture escolhe WebP com fallback PNG; preload tipado e fetchPriority high priorizam a mesma imagem, sem imagem duplicada em CSS. width/height e espaço reservado estabilizam o layout. A imagem é decorativa (alt vazio) e não contém textos de interface.

HeroBackground mantém uma composição única, sem recortes animados de objetos. Três sobreposições radiais suaves alteram opacity em 600ms: balança central, documentos inferiores à esquerda e notebook à direita. Texto contextual usa camadas em grid, com fade e deslocamento de 5px em 350ms. Todas as camadas têm chaves estáveis; não há temporizadores ou filas. Repetir a seleção ativa mantém o estado. Reserva de espaço para a maior mensagem evita deslocamento do título e das ações. As mensagens comerciais estão em segmentos.ts; o restante do conteúdo está em hero.ts.

Hero consome o useSegment existente, sem novo estado global. Estado null não ativa camadas nem mensagem contextual. Uma região status polite anuncia somente o segmento atual e seu texto; camadas de transição são decorativas para leitores de tela. Ações Conheça os planos e Ver como funciona estão nativamente disabled, descritas por Disponíveis em breve. Sem links falsos ou rolagem automática.

Desktop: composição de tela cheia, texto à esquerda e objetos preservados à direita. Tablet/mobile: tipografia fluida, recuo da navbar, enquadramento em 61–62% e gradientes adaptados à leitura; o conteúdo pode crescer verticalmente em telas menores, sem corte. Cores de texto e ações foram centralizadas nos tokens. prefers-reduced-motion remove as transições e os deslocamentos; o estado e os textos não dependem das animações.

Validação: npm run typecheck, npm run lint, npm run format:check e npm run build. Navegador em 1600×900, 1440×900, 768×1024 e 390×844, sem overflow horizontal ou sobreposição do título pela navbar. Estado geral sem destaques; os três segmentos atualizam as mensagens exatas e a camada visual correspondente. Testadas alternâncias rápidas, clique repetido no ativo, seleção por Enter no mobile e fechamento do menu. Título e ações mantiveram os mesmos retângulos antes/depois da seleção no desktop. A versão WebP foi confirmada por currentSrc. Redução de movimento conferida nas regras CSS; o navegador disponível não expõe emulação dessa preferência, portanto esse teste de execução permanece limitado. Nenhuma funcionalidade do S03 foi iniciada.

Referência: a fotografia original e a composição descrita no roteiro foram utilizadas. Não houve captura adicional da landing completa anexada no S02, portanto não foi possível verificar equivalência pixel a pixel. Mobile usa enquadramento diferente, conforme permitido. Pendências S03: destinos reais dos planos e conteúdo explicativo, habilitação das ações após existência das seções e integração de navegação/transição para propostas mediante autorização.

## S03 — Navegação integrada

Navegação central em src/lib/sectionNavigation.ts, exposta pelo hook src/hooks/useSectionNavigation.ts. SectionLink (src/components/common) conserva hrefs nativos reais e encaminha ativações normais ao mesmo controlador. Clique com modificadores mantém comportamento nativo. O SegmentProvider e o contrato de useSegment permanecem intactos; não há outro contexto ou biblioteca.

Seleção atualiza o contexto e inicia uma requisição cancelável. Após dois frames para o commit React e fechamento do menu, o controlador aguarda as animações reais da hero e do menu via getAnimations/finished. Sem prazo fixo. Se não houver animações, continua normalmente. A preferência prefers-reduced-motion usa rolagem instantânea e dispensa a espera das animações.

Uma única requisição compartilhada, com AbortController, cancela a anterior e interrompe eventual scroll nativo em andamento. Frames e listeners são limpos por cancelamento, scrollend ou desmontagem. Interação manual por roda, toque, ponteiro e teclas de navegação cancela pendências. Não há temporizadores, efeitos de navegação no carregamento ou filas de rolagens. Seleção repetida do segmento ativo também permite voltar a planos.

Destinos reais: inicio (agora na hero), planos e como-funciona. Resultados permanece texto indisponível; nosso-time está apenas reservado no tipo SectionId. Não foram criados destinos vazios para seções futuras. Todas as buscas de destino e chamadas de scroll estão centralizadas no controlador.

Plans.tsx contém a seção planos sem cards, com título geral ou título por segmento, descrição das duas linhas de atuação e contexto do segmento. HowItWorks.tsx contém a explicação editorial de entendimento da operação, definição da solução e desenvolvimento/integração conforme escopo contratado. Textos em src/content/navigation.ts e estilos em src/sections/Plans/plans.css. Conteúdo comercial definitivo ainda sujeito à revisão editorial.

Conheça os planos e Soluções navegam a planos. Ver como funciona e Como funciona navegam a como-funciona. Logo retorna a inicio. Sem seleção, planos apresenta a visão geral; navegar não escolhe um segmento. Os efeitos de luz, desfoque, enquadramento e alinhamento aprovados da hero foram preservados. A mensagem de indisponibilidade das ações foi removida, reservando o espaço visual correspondente.

Menu mobile fecha antes da navegação e inclui links reais no ciclo de foco por Tab/Shift+Tab. O título de destino recebe foco com preventScroll, seguido de uma única chamada scrollIntoView. scroll-margin-top deriva da variável --navbar-height + 16px. Tablet e mobile usam o recuo de 72px; desktop, 84px. App encerra navegação pendente ao desmontar.

Arquivos novos: src/lib/sectionNavigation.ts, src/hooks/useSectionNavigation.ts, src/components/common/SectionLink.tsx, src/content/navigation.ts, src/sections/Plans/{Plans.tsx,HowItWorks.tsx,plans.css}, tests/sectionNavigation.test.mjs. Modificados: App, SegmentSelector, InstitutionalNavigation, MobileMenu, Navbar, Hero, HeroActions, estilos de Navbar/Hero, conteúdo hero, index.html, package.json e README. AGENTS.md preservado; a autorização S03 está na solicitação desta sessão. Nenhuma dependência instalada.

### Validação S03

- npm run test: testes nativos Node de espera da transição, última ação prevalecendo, movimento reduzido simulado, execução sem animações, cancelamento manual, destino inexistente e desmontagem; inclui verificação de ausência de navegação inicial e foco sem segunda rolagem.
- npm run typecheck, npm run lint, npm run format:check e npm run build.
- Navegador: 1600×900, 1440×900, 768×1024 e 390×844. Seleção de cada segmento, cliques rápidos, repetição do ativo, ações da hero, links institucionais, logo, mobile e Enter no menu.
- Destino planos em top 100px no desktop e 88px no tablet/mobile, com títulos abaixo da navbar. Foco confirmado no título correto, segmento preservado, menu fechado e body sem bloqueio de scroll.
- Nova aba inicia em scrollY 0 e segmento geral. Conheça os planos mantém a visão geral. Zero âncoras quebradas e nenhum novo erro/aviso no console. Sem overflow horizontal.
- O teste de movimento reduzido é automatizado com matchMedia simulado; o navegador disponível não expõe emulação dessa preferência. Não se declara emulação visual completa.

### Contrato para S04

Expandir a seção existente src/sections/Plans/Plans.tsx, preservando id planos, planos-title e consumo de useSegment. Usar os dois serviços já tipados em src/content/planos.ts; não recriar o destino nem a navegação. SectionId reserva resultados e nosso-time, sem disponibilizar links enquanto as seções não existirem. S04 não iniciado; sem cards, preços, WhatsApp, resultados, backend ou publicação.

## S04 — Cards de soluções

A seção existente planos foi expandida com exatamente dois PlanCard reutilizáveis: servico-ia e automacao-processos. O id planos, planos-title, consumo de useSegment e controlador do S03 foram preservados. Navbar, hero, animações de luz/desfoque e lógica de rolagem não foram alterados. Atualizar o conteúdo dos cards não cria outro efeito de navegação.

Dados em src/content/planos.ts: nome institucional, descrição geral, cinco entregas principais, CTA e Record tipado com título, descrição e aplicações por segmento. Estado null exibe os dois serviços institucionais; Advocacia, Contabilidade e Imobiliárias usam o mesmo componente com dados contextualizados. Títulos e descrições da seção estão em src/content/navigation.ts. Exemplos são possibilidades conforme escopo, sem alegações de funcionalidades já entregues, preços, garantias, clientes ou resultados fictícios. Nota de uso autorizado e respeito às licenças acompanha os cards.

PlanCard.tsx organiza identificação, ícone SVG decorativo, h3, descrição, lista HTML e contato. Grid de duas colunas em desktop; uma coluna abaixo de 900px. Cards têm alturas equilibradas e CTAs alinhados por flex/grid. Tipografia e espaçamentos adaptam no mobile. Atualização de conteúdo é imediata, sem timers, estado duplicado ou animação de entrada que esconda textos. Hover discreto, removido para prefers-reduced-motion. Não há novas dependências ou requisições externas.

### Contato comercial

src/lib/whatsapp.ts expõe buildServiceMessage(serviceId, segment) e buildWhatsAppUrl(phone, message). Mensagem identifica serviço e segmento, com contexto geral para null. Número é validado sintaticamente em formato internacional (8–15 dígitos, código do país sem zero inicial; aceita + e pontuação usual). Isso não verifica titularidade nem existência de conta. URL HTTPS wa.me usa encodeURIComponent. Links configurados usam target _blank e rel noopener noreferrer.

src/content/contatos.ts permanece com whatsapp null. Os dois CTAs estão disabled e associados à informação Contato oficial em configuração; nenhum link de teste é gerado ou aberto. A única pendência para ativar os CTAs é receber e configurar o número oficial confirmado da VYMPA. Não foram criados botões flutuantes.

### Arquivos S04

Criados: src/sections/Plans/PlanCard.tsx, src/lib/whatsapp.ts e tests/plans.test.mjs.
Alterados: src/sections/Plans/Plans.tsx e plans.css, src/content/planos.ts, src/content/navigation.ts, src/types/content.ts e README.md. AGENTS.md e os scripts anteriores foram preservados. Não houve commit, push, deploy ou início do S05 nesta etapa.

### Validação S04

- npm run test: 15 testes aprovados, incluindo SSR React dos dois cards no estado geral e nos três segmentos, preservação do id planos, ausência de preços/links inválidos, CTAs indisponíveis, mensagens para os oito pares serviço/segmento e validação/codificação da URL. A suíte anterior de navegação também passou. Um número sintético reservado existe somente como fixture de teste; nunca foi configurado como contato nem aberto no navegador.
- npm run typecheck, npm run lint, npm run format:check e npm run build executados.
- Navegador em 1600×900 e 1440×900: dois cards lado a lado, alturas e posições dos CTAs equivalentes. Estado inicial geral, os três segmentos e alternâncias rápidas conferidos; última seleção Imobiliárias mantida nos dois cards.
- Tablet 768×1024 e mobile 390×844: cards empilhados, sem cortes ou overflow horizontal. Seleção por Enter no menu mantém fechamento, foco em planos-title e destino a 88px do topo, abaixo da navbar de 72px. Desktop mantém destino a 100px, abaixo da navbar de 84px.
- Conheça os planos alcança o mesmo destino. Console sem novos erros/avisos, zero âncoras quebradas e zero links WhatsApp enquanto o número estiver ausente. Não foram enviadas mensagens externas.
- Regras CSS de movimento reduzido conferidas. A suíte do S03 testa o caminho de preferência reduzida com matchMedia simulado; o navegador não expõe emulação visual completa dessa preferência.

### Handoff S05

Cards e contratos dos serviços estão prontos, com contatos centralizados e utilitário de mensagem reutilizável. A base de clientes permanece em src/content/clientes.ts, vazia, com tipo Client compartilhado. Para um carrossel real serão necessários nomes/logos e autorização de uso dos clientes; nenhum conteúdo de clientes foi inventado. S05 não iniciado.

## S05 — Clientes autorizados e carrossel

Implementados src/sections/Results/{Results.tsx,ClientCarousel.tsx,ClientLogo.tsx,results.css}, com validação em src/lib/clients.ts. public/images/clientes/.gitkeep preserva a pasta de imagens oficiais. O tipo Client existente ganhou textoAlternativo e autorizadoParaDivulgacao, sem duplicação de interfaces; logoUrl e segmento foram mantidos.

O array src/content/clientes.ts continua vazio: não foram fornecidos clientes reais ou autorizações de divulgação. Assim, Results retorna null, sem títulos, mensagens de estado vazio, espaço extra ou id resultados. Registros válidos aguardam uma imagem carregada antes de tornar a seção visível. Erros removem o logo; se todos falharem, o módulo inteiro desaparece. Imagens inicialmente pendentes não geram falsa prova social. O primeiro logo é carregado eager; os demais usam lazy loading e dimensões reservadas.

### Cadastro de clientes reais

1. Obter autorização expressa de divulgação fora do código. O booleano não substitui essa autorização.
2. Colocar o arquivo oficial, sem recoloração, em public/images/clientes/. Formatos aceitos: SVG, PNG ou WebP. Usar nomes previsíveis com letras, números, hífen ou sublinhado.
3. Adicionar um registro Client em src/content/clientes.ts: id estável, nome, logoUrl com caminho absoluto /images/clientes/arquivo.ext, textoAlternativo significativo, autorizadoParaDivulgacao e segmento (ou null).
4. Manter autorizadoParaDivulgacao false enquanto a divulgação não estiver autorizada. Campo ausente não implica aprovação.

A validação rejeita ID inválido, nome/alt vazios, fonte ausente ou fora da pasta local, formatos não aceitos, duplicações por ID, nome normalizado ou arquivo. Apenas autorizadoParaDivulgacao === true pode aparecer. O carregamento real verifica a imagem. Não são baixadas marcas da internet, criados links externos ou expostos leads/parceiros como clientes.

### Comportamento e acessibilidade

Sem clientes válidos: nenhum bloco. Poucos logos que cabem: centralizados, sem controles ou movimento automático. Overflow real: ResizeObserver mede viewport e trilho; surgem setas Anterior/Próximo, com limites corretos, scroll snap, scrollbar nativa e rolagem horizontal controlada pelo usuário. Não há clones de marcas, autoplay ou limite baseado apenas em contagem.

Logos preservam proporções e cores, com áreas moderadas de 190×116px no desktop e 150×100px no mobile. Teclado: região focável quando há overflow, setas direcionais, Home e End, além dos botões semânticos. Foco visível e nomes acessíveis; sem anúncios repetitivos. Mouse pode arrastar; touch permanece nativo, sem bloqueio de gestos verticais. prefers-reduced-motion seleciona scroll instantâneo. Não há efeitos contínuos ou filtros nos logos.

App integra Results após Como funciona. O estado local de disponibilidade habilita o link Resultados no desktop e mobile somente quando a seção real existe. A única alteração na navbar foi essa disponibilidade opcional, sem redesign. Não foi criado outro Context API nem outra lógica de navegação. Hero e cards S04 não foram alterados nesta etapa; suas mudanças anteriores foram preservadas.

### Arquivos e testes S05

Novos: src/lib/clients.ts; os quatro arquivos de Results; public/images/clientes/.gitkeep; tests/clients.test.mjs, clients-harness.tsx, clients-harness.html e clients-browser-server.mjs. Removido apenas o .gitkeep da pasta Results, agora implementada. Alterados: src/content/clientes.ts, src/types/content.ts, src/app/App.tsx, Navbar.tsx, MobileMenu.tsx, InstitutionalNavigation.tsx e README. tests/plans.test.mjs recebeu isolamento de cache/WebSocket para testes SSR paralelos; isso elimina conflito de porta sem mudar a aplicação. AGENTS.md preservado.

npm run test: 18 testes aprovados, incluindo autorização, integridade, duplicados, contagem, limites por largura, estado vazio SSR, conteúdo aguardando imagem válida e ativação condicional do link Resultados. Suítes de planos/WhatsApp e navegação também passaram. npm run typecheck, npm run lint, npm run format:check e npm run build foram executados.

Para reproduzir o QA visual: node tests/clients-browser-server.mjs e abrir http://127.0.0.1:5174/tests/clients-harness.html. Servidor restrito a localhost. Fixtures sintéticas são geradas somente em memória por esse servidor de testes; não há arquivos de marcas fictícias em public. O build normal inclui apenas a entrada da aplicação, sem harness ou fixtures.

Navegador: 1600×900, 1440×900, 768×1024 e 390×844. Conferidos 0, 1, 2, 3 e 12 logos, autorização negada, referência inválida, imagem que falha, duplicados e recuperação quando a primeira imagem falha mas outra é válida. Setas, limites inicial/final, Home/End, Enter, foco visível e arraste por mouse passaram. Três logos cabem no tablet e exigem carrossel no mobile; em orientação 844×390 voltam a caber e os controles desaparecem. Sem overflow horizontal da página. Console sem novos erros/avisos no harness ou na página real.

Na aplicação real, array vazio confirmado, sem seção/id/link ativo de Resultados; dois cards preservados e seleção Contabilidade continuou navegando a planos abaixo da navbar. Zero âncoras quebradas. Toque em aparelho físico e emulação real de prefers-reduced-motion não estavam disponíveis; não são declarados como testes executados.

### Pendência e handoff S06

Pendente somente o fornecimento de clientes reais, arquivos oficiais e autorização expressa para tornar a prova social pública. O S05 funciona corretamente vazio. O S06 poderá adicionar seu gráfico dentro de Results, preservando o único id resultados e ampliando a disponibilidade para conteúdo visível de clientes OU gráfico. ClientCarousel e ClientLogo não precisam ser modificados; o bloco de clientes continuará condicionado a marcas válidas. Nenhum gráfico, simulação, depoimento, equipe, integração externa, push ou deploy foi implementado neste script. S06 não iniciado.

## S06 — Comparação financeira ilustrativa

Um único gráfico SVG nativo, sem nova biblioteca ou dependência, foi integrado à seção Resultados. A escolha permite duas séries, escala numérica, pontos mensais, interação por ponteiro/clique/toque, seletor de mês por teclado e tabela HTML equivalente sem adicionar uma biblioteca de gráficos para essa necessidade restrita.

### Arquitetura e arquivos

Criados: src/lib/financialComparison.ts; src/sections/Results/{ClientShowcase.tsx,FinancialComparison.tsx,ComparisonChart.tsx,comparison.css}; tests/financialComparison.test.mjs. Alterados: src/content/simulacao.ts, src/types/content.ts, src/sections/Results/Results.tsx, tests/clients.test.mjs, tests/clients-harness.tsx e README.md. O bloco de clientes do S05 foi extraído para ClientShowcase sem alterar ClientCarousel ou ClientLogo. Navbar, hero, cards, imagens e controlador de navegação não foram alterados.

Results é o único dono do id resultados e compõe clientes opcionais + comparação. O gráfico está disponível mesmo sem clientes; o callback existente de disponibilidade habilita o link Resultados. ClientShowcase retorna null quando não há clientes válidos e remove imagens com erro, preservando a ausência de espaço vazio. Não há IDs duplicados no modo combinado.

### Modelo e validação

Para cada mês m: C_tradicional = m × custoTradicionalMensal; C_ia = investimentoInicial + m × (custoOperacionalIA + manutencaoMensalIA); diferença = C_tradicional − C_ia. Regras em calculateComparison, sem fórmulas financeiras duplicadas na interface. Cálculos intermediários em centavos inteiros; saídas numéricas em reais. Custos devem ser finitos, não negativos, com até duas casas decimais e dentro do limite inteiro seguro. Horizonte inteiro entre 1 e 120; zero é rejeitado. Valores que estouram a precisão segura são rejeitados. Configuração inválida mostra mensagem de revisão, sem gráfico, NaN ou Infinity.

Pontos incluem mês zero (tradicional 0, IA com implantação inicial) até o horizonte. Equilíbrio é o primeiro ponto com diferença >= 0, incluindo mês zero, conforme explicado na interface. Sem equilíbrio no horizonte: Não atingido no período simulado. Diferença negativa é descrita como maior custo acumulado com IA; igualdade tem mensagem própria. O equilíbrio inicial no mês zero não garante vantagem nos meses seguintes.

Formatação monetária única via Intl.NumberFormat pt-BR/BRL. O mesmo FinancialResult alimenta as duas linhas, resumo, valores inspecionados e tabela. Eixo Y inicia em zero, com teto calculado sobre ambas as séries; linha tradicional cinza tracejada e linha IA verde #68DDA8 contínua, diferenciadas por texto e padrão além de cor. Todos os pontos mensais são renderizados; rótulos X são espaçados conforme largura/horizonte, mantendo todos os meses disponíveis no seletor e tabela.

### Premissas e status editorial

Fixture demonstrativa do roteiro: 12 meses, custo tradicional 10.000/mês, operacional IA 7.000/mês, manutenção 500/mês e implantação 12.000. Mesmo volume de trabalho, sem quantidade inventada. Resultado: tradicional 120.000; IA 102.000; diferença hipotética 18.000; primeiro equilíbrio no mês 5. Custos constantes, sem inflação, tributos adicionais ou desconto a valor presente. Não são orçamento, preços oficiais ou resultados reais.

simulacao.aprovacao permanece pendente. Publicação em produção depende da aprovação expressa das premissas e valores pela VYMPA. A interface mostra o aviso integral exigido junto ao gráfico, status pendente e identificação hipotética dentro da própria figura. Troca de segmento altera somente a introdução editorial: não existem parâmetros financeiros setoriais inventados.

### Interação, responsividade e acessibilidade

Ponteiro e clique/toque selecionam o mês mais próximo; o painel informativo permanece visível. Range nativo permite todos os meses, Home/End e setas, com aria-valuetext contendo os valores completos. Tabela acessível em details nativo, cabeçalhos semânticos, caption, mês zero e todos os pontos; container focável com rolagem horizontal interna. Nenhuma informação depende só de hover, tooltip ou cor.

SVG ajusta o viewBox à largura medida, com fonte de eixo em 12px. A altura de 360px ou 260px é reservada via container query, evitando deslocamento externo durante a medição. Tooltip, resumo e premissas empilham no celular. Sem animação de entrada ou progressiva: dados completos aparecem imediatamente inclusive sob movimento reduzido. A rolagem da página continua usando o S03, que já trata essa preferência.

### Validação S06

npm run test: 22 testes aprovados. Cobertura: implantação no mês zero, custos recorrentes, manutenção, diferença, equilíbrio, resultado negativo, igualdade, centavos, horizontes 1/24/120, horizonte zero/inválido, custos negativos/não finitos/precisão excessiva/overflow, formatação BRL e SSR de gráfico/tabela/avisos. Verificados um gráfico, duas séries, 13 linhas de tabela, id resultados único, clientes ausentes sem container, conteúdo por segmento e fallback de configuração inválida. Suítes anteriores também passaram.

npm run typecheck, npm run lint, npm run format:check e npm run build executados. Navegador: 1600×900, 1440×900, 768×1024 e 390×844. Link Resultados funcional, título abaixo da navbar, sem overflow horizontal ou novos erros no console. Mês 1: 10.000 vs 19.500, diferença -9.500; mês 5: 50.000 vs 49.500, diferença 500; mês 12: 120.000 vs 102.000, diferença 18.000. Teclado, ponteiro e abertura da tabela conferidos; tabela mobile rola internamente (largura 688px em viewport 327px), sem alargar a página. Contextos de Advocacia e Imobiliárias e alternâncias rápidas preservaram totais e curvas; a suíte SSR cobre os três segmentos.

Harness isolado do S05 ganhou botão Alternar comparação S06 e SegmentProvider. Testados nenhum, três e doze clientes sintéticos junto ao gráfico, avanço do carrossel e retirada de autorização: um único id resultados e um único gráfico em todos os cenários, sem espaço de clientes quando ocultos. Fixtures continuam fora de public e do build normal. Nenhuma mensagem ou dado financeiro de visitante é coletado/enviado. Toque em aparelho físico e emulação real de movimento reduzido não estão disponíveis; não se declara teste de dispositivo físico. O gráfico é estático quanto a animações por projeto.

### Pendências e handoff S07

Aprovar premissas e valores antes de publicar em produção; até lá são apenas demonstração explicitamente identificada. Clientes reais continuam ausentes, o que não bloqueia a comparação. S07 deve preservar o id resultados, callback de disponibilidade, componente ClientShowcase, dados/cálculos únicos e avisos editoriais. O modelo TeamMember e src/content/equipe.ts continuam preparados e vazios; a seção de equipe não foi implementada. Sem commit, push ou deploy nesta etapa. S07 não iniciado.

## Revisão S06 — comparação conceitual de crescimento

A solicitação posterior do usuário substitui o modelo de custos descrito acima. A seção agora mostra um índice ilustrativo de evolução com base comum 100: trajetória com IA e automação fortemente crescente; trajetória sem IA inicialmente estável e depois decrescente. Os valores são coordenadas de um cenário conceitual, não receita, lucro, produtividade observada, previsão ou resultado garantido da VYMPA. A configuração continua pendente de aprovação para publicação.

Removidos da interface: custos em reais, investimento, manutenção, ponto de equilíbrio, resumo financeiro, bloco de premissas e avisos extensos. Permanece uma indicação curta junto ao gráfico de que se trata de simulação conceitual sem garantia de crescimento. A tabela de índices permanece recolhida como alternativa acessível; tooltip e teclado continuam funcionais.

GrowthComparison e lib/growthComparison.ts substituem os componentes e cálculos financeiros da implementação anterior. Dados em src/content/simulacao.ts e tipo GrowthSimulation. As séries compartilham mês zero e base 100; diferenças são pontos de índice (IA menos cenário sem IA). Testes atualizados para séries válidas, índices finitos e consistência entre gráfico/tabela nos quatro contextos.

Validação da revisão: 21 testes aprovados; typecheck, lint, format:check e build. Navegador em 1440×900 e 390×844: sem overflow horizontal ou novos erros no console; zero blocos de premissas, sem reais no módulo, duas linhas e tabela de 13 meses. Sem publicação ou início do S07.

## S07 — Nosso Time: quatro sócios

A correção explícita do usuário substitui todas as referências a três sócios no roteiro: são quatro cards. Integrados depois de Resultados, preservando Como funciona na posição existente, sem mudanças em navbar, hero, propostas, carrossel ou gráfico. A seção usa id nosso-time e o título exato Nosso Time:.

### Estrutura e arquivos

Criados src/sections/Team/Team.tsx, TeamMemberCard.tsx e team.css; src/lib/team.ts; public/images/equipe/.gitkeep; tests/team.test.mjs, team-harness.html e team-harness.tsx. Alterados src/app/App.tsx, src/content/equipe.ts, src/types/content.ts, src/styles/tokens.css e README.md. Removido apenas o .gitkeep da pasta Team implementada. Nenhuma dependência nova; AGENTS.md preservado.

Team gera os cards a partir dos dados, sem HTML duplicado. TeamMemberCard cuida da imagem opcional, object-fit cover, object-position individual, overlay, informações e fallback para área vazia se a imagem falhar. Cards informativos não são botões, links nem recebem tabindex. Textos continuam no DOM acessível mesmo fora do hover; navegação por teclado com foco visível revela informações, e telas pequenas ou dispositivos sem hover mostram os dados cadastrados permanentemente.

### Visual e animação

Fundo #171B2D, título centralizado, gap de 50px até os cards, espaçamento de 20px e cantos retos. Container desktop ampliado para 1320px para acomodar os quatro retratos de aproximadamente 315×400px, mantendo a proporção da referência textual. Abaixo de 1100px: duas colunas, limitadas a 650px. Abaixo de 600px: uma coluna com largura máxima de 315px. Aspect-ratio mantém proporções sem alturas fixas.

Áreas sem foto usam fundo neutro quase branco, sem imagem fictícia, ícone, emoji, nome/cargo inventado ou URL inexistente. Hover individual de 280ms em opacity/transform, com gradiente sutil escuro esverdeado e nome/cargo/descrição centralizados na base. Sair desfaz o efeito sem deslocar nenhum card. prefers-reduced-motion remove as transições. Não há brilho, zoom, carrossel ou 3D.

### Como cadastrar os quatro perfis oficiais

Os registros socio-01, socio-02, socio-03 e socio-04 estão em src/content/equipe.ts, com nome, cargo e descricao vazios; fotoUrl null; textoAlternativo vazio; ordem 1–4 e status pendente. Não há integrantes fictícios. Copiar as fotografias oficiais para public/images/equipe/ e preencher fotoUrl com /images/equipe/nome-do-arquivo.webp (ou jpg/jpeg/png/avif). Preencher nome, cargo, descricao profissional curta e textoAlternativo; ajustar posicaoFoto para enquadrar o rosto se necessário.

Somente após validar os dados e fotografias, mudar status para publicado. A prévia npm run dev inclui os quatro rascunhos em branco. O build de produção não exibe perfis pendentes ou sem nome, cargo, foto local válida e texto alternativo. O status não substitui a validação real. No estado atual a seção definitiva não é publicada, conforme o roteiro. A estrutura permite adicionar integrantes e ordenar registros sem modificar o layout dos componentes.

### Validação S07

npm run test: 23 testes aprovados. Novos testes cobrem quatro áreas sem img/h3 fictício, estado de produção sem rascunhos, dados opcionais, fotografia/enquadramento configuráveis, ordenação, duplicados e bloqueio de perfis incompletos. npm run typecheck, npm run lint, npm run format:check e npm run build aprovados.

Navegador: 1600×900 e 1440×900 com quatro colunas; 768×1024 com duas colunas; 390×844 com uma coluna. Sem overflow horizontal ou novos erros no console, nenhuma imagem solicitada nos quatro slots vazios. Com fixtures exclusivamente no harness de testes, primeiro card apresentou overlay/texto com opacidade 1 e os demais 0, mantendo todos os retângulos exatamente iguais. Alternância rápida entre os quatro cards manteve apenas o último ativo; retirar o ponteiro devolveu todas as opacidades a 0. Teclado revelou os dados via foco visível; no mobile os textos permanecem visíveis, sem controles artificiais ou dependência de hover.

Harness: http://127.0.0.1:5173/tests/team-harness.html enquanto npm run dev estiver ativo. Contém somente nomes/cargos explicitamente sintéticos de teste, sem fotografias. Esse HTML e suas fixtures não entram no build normal. A página principal continua com os quatro espaços e campos profissionais em branco.

Regressão: seleção Contabilidade ainda navega para planos; dois cards, um gráfico, quatro slots de equipe; ordem inicio, planos, como-funciona, resultados, nosso-time; zero âncoras quebradas. Regras CSS de movimento reduzido conferidas, sem emulação real dessa preferência no navegador. Não foi testado toque em aparelho físico; os cards não precisam de toque para revelar informações no mobile.

### Referência, pendências e handoff S08

Só foi recebido Texto colado.txt, sem vídeo ou captura específica da seção. Não há vídeo no workspace, portanto não foi possível comparar frames nem afirmar fidelidade visual absoluta. A implementação segue as especificações textuais, adaptadas aos quatro sócios. Pendentes: quatro fotografias oficiais e nomes, cargos, descrições e textos alternativos aprovados. Publicação final depende desses dados.

S08 deve preservar id nosso-time, quatro posições, ordenação/publicação dos perfis, proporção e hover, além dos módulos anteriores. Não foram implementados botões flutuantes, redes sociais, rodapé definitivo ou funcionalidades do S08. Sem commit, push ou deploy nesta etapa.
