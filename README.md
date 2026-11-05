# VYMPA

**Sistemas, automação e inteligência artificial sob medida para escritórios.**

A VYMPA desenvolve soluções digitais alinhadas à realidade de cada operação. Este repositório reúne seu site institucional: uma apresentação dos serviços, dos segmentos atendidos, da forma de trabalho e das pessoas por trás da empresa.

## Tecnologia a serviço dos escritórios

Escritórios de advocacia, contabilidade e empresas imobiliárias lidam diariamente com documentos, informações, solicitações e atividades recorrentes. Organizar esses fluxos é essencial para dar continuidade ao atendimento, acompanhar demandas e permitir que as equipes dediquem mais atenção ao trabalho que exige conhecimento e decisão.

Nesse contexto, sistemas personalizados e automações podem conectar ferramentas, centralizar informações e reduzir etapas manuais. A inteligência artificial amplia essas possibilidades ao apoiar consultas, organização de conteúdo e outras atividades compatíveis com as necessidades do negócio.

A proposta da VYMPA é partir dos processos de cada cliente para definir a tecnologia adequada. Uma implementação de IA exige planejamento, integração com a operação e supervisão humana. Os benefícios dependem do contexto, da qualidade das informações e do escopo de cada projeto.

## O que o site apresenta

A navegação permite explorar uma visão geral da VYMPA ou selecionar **Advocacia**, **Contabilidade** e **Imobiliárias**. Os textos e exemplos de aplicação acompanham o segmento escolhido.

| Seção                           | O que apresenta                                                                                                                                                             |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Apresentação**                | A proposta da VYMPA e o desenvolvimento de soluções digitais sob medida para escritórios.                                                                                   |
| **Soluções VYMPA**              | Duas frentes de atuação: sistemas personalizados com IA e automação de fluxos de processos, com entregas e possibilidades de aplicação por segmento.                        |
| **Como funciona**               | As etapas de diagnóstico, planejamento e implementação, conectando os desafios da operação ao desenvolvimento da solução.                                                   |
| **Quem confia na VYMPA**        | Empresas atendidas, apresentadas por seus logotipos em um carrossel com navegação entre as marcas cadastradas.                                                              |
| **IA, automação e crescimento** | Uma comparação interativa de cenários hipotéticos de evolução operacional. A visualização é ilustrativa e não representa resultados de clientes ou garantia de crescimento. |
| **Nosso Time**                  | Os perfis profissionais da equipe, com fotografia, nome e função dos integrantes cadastrados.                                                                               |
| **Mais sobre a VYMPA**          | Quatro cards de fechamento: apresentação da empresa, pesquisa sobre implementação estruturada de IA, próximos passos após a entrega e canais de contato.                    |
| **Rodapé e contatos**           | Identidade da marca, retorno ao início e acesso aos canais oficiais disponíveis. Os botões flutuantes mantêm o contato acessível durante a navegação.                       |

O conteúdo distingue referências de pesquisa, simulações e informações reais da empresa. O card sobre adoção estruturada de IA inclui um link para a pesquisa utilizada como fonte.

## Experiência de navegação

O site foi desenvolvido para computadores, tablets e celulares. A interface combina navegação por seções, seleção de segmentos, carrossel de clientes e efeitos visuais nos cards. Os controles oferecem suporte a teclado e as animações respeitam a preferência por movimento reduzido.

## Tecnologias utilizadas

O projeto utiliza **React**, **TypeScript** e **Vite**, com **CSS e Tailwind CSS** na interface. **ESLint** e **Prettier** apoiam a consistência do código, e o executor de testes do **Node.js** é utilizado nas verificações automatizadas.

## Executar localmente

Pré-requisito: Node.js 22.12 ou superior na linha 22, ou Node.js 24 ou superior, e npm.

```sh
npm ci
npm run dev
```

Abra o endereço informado pelo Vite no terminal. Por padrão, o projeto utiliza `http://127.0.0.1:5173`; outra porta pode ser escolhida caso esteja ocupada.

Para gerar e visualizar a versão de produção:

```sh
npm run build
npm run preview
```

## Verificações do projeto

```sh
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

## Organização e atualização do conteúdo

Os textos institucionais, serviços, contatos, clientes e perfis da equipe ficam em `src/content`. As seções da página estão em `src/sections`, os componentes reutilizáveis em `src/components` e os estilos globais em `src/styles`. Imagens e fontes locais ficam em `public`.

Os dados de contato são mantidos em `src/content/contatos.ts`. Instagram e e-mail estão configurados; o WhatsApp será exibido quando seu número for cadastrado. Os links de e-mail abrem a composição de uma mensagem no Gmail.

Clientes e integrantes da equipe devem ser cadastrados com informações e imagens aprovadas. Credenciais e informações confidenciais não devem fazer parte do código ou de variáveis públicas `VITE_`.

As orientações de contribuição e os limites de escopo estão em [AGENTS.md](AGENTS.md).

## Contato

- [Instagram — @vympadev](https://www.instagram.com/vympadev)
- [E-mail — vympa02@gmail.com](https://mail.google.com/mail/?view=cm&fs=1&to=vympa02%40gmail.com)
