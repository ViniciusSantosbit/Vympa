# VYMPA Landing

S00 a S03 concluídos. S04 a S13 não iniciados. Projeto criado diretamente na pasta Vympa, inicialmente vazia, pelo template oficial React/TypeScript do Vite.

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
