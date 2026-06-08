---
date: 2026-06-08
topic: frontend-foundation
---

# Frontend Foundation Requirements

## Summary

Reformular a fundação visual do SGPPF em `web/` para entregar uma experiência
institucional Mauá, clara e produtiva para todos os perfis. A navegação e o
dashboard devem preparar o sistema para crescer sem inventar dados ou alterar
regras de negócio.

## Problem Frame

A implementação atual oferece os fluxos essenciais, mas apresenta os módulos
como uma coleção simples de telas CRUD. A identidade institucional é fraca, a
navegação superior tem pouco espaço para crescimento e o dashboard não comunica
os dados com a clareza esperada de uma ferramenta administrativa.

## Key Decisions

- **Navegação lateral adaptativa.** O menu começa expandido em telas grandes,
  assume uma forma compacta em notebooks e vira uma gaveta em telas móveis.
- **Institucional Mauá orientado a dados.** Azul institucional, hierarquia clara
  e superfícies sóbrias devem coexistir com boa densidade de informação.
- **Base compartilhada antes de telas específicas.** A primeira entrega melhora
  o shell, a navegação e os padrões visuais usados por todos os perfis.
- **Dados reais somente.** O dashboard pode melhorar sua apresentação, mas deve
  utilizar apenas os indicadores já disponíveis.

## Actors

- A1. **Administrador** — navega por todos os módulos e administra usuários.
- A2. **Pesquisador** — registra e consulta sua produção acadêmica.
- A3. **Consultor** — consulta dados institucionais sem ações de escrita.

## Key Flows

- F1. **Navegação entre módulos**
  - **Trigger:** Um usuário autenticado precisa acessar outra área.
  - **Actors:** A1, A2, A3
  - **Steps:** O usuário identifica o módulo no menu lateral, reconhece o item
    ativo e abre a área desejada.
  - **Outcome:** O usuário entende onde está e chega ao módulo com uma ação.

- F2. **Consulta inicial do dashboard**
  - **Trigger:** Um usuário entra no sistema.
  - **Actors:** A1, A2, A3
  - **Steps:** O usuário visualiza indicadores existentes e identifica atalhos
    para aprofundar a consulta.
  - **Outcome:** O dashboard comunica rapidamente o estado dos dados disponíveis.

## Requirements

**Identidade e hierarquia**

- R1. A interface deve apresentar identidade institucional Mauá sem prejudicar
  a leitura de grandes volumes de dados.
- R2. Todas as páginas autenticadas devem compartilhar hierarquia visual,
  espaçamento e comportamento responsivo consistentes.
- R3. A página atual e seu contexto devem ser reconhecíveis sem depender apenas
  do conteúdo central.

**Navegação**

- R4. A navegação principal deve usar um menu lateral adaptativo.
- R5. O menu deve mostrar apenas módulos permitidos ao perfil autenticado.
- R6. O estado ativo, os nomes dos módulos e seus ícones devem ser claros.
- R7. Em telas móveis, o menu deve abrir como gaveta e preservar acesso ao
  perfil e à saída.

**Dashboard e produtividade**

- R8. O dashboard deve apresentar os seis indicadores existentes com hierarquia
  visual adequada para leitura rápida.
- R9. Indicadores e áreas vazias devem oferecer caminhos claros para os módulos
  relacionados, respeitando as permissões do usuário.
- R10. A interface não deve exibir métricas fictícias nem sugerir recursos que
  ainda não possuem suporte de dados.

**Acessibilidade e responsividade**

- R11. Navegação, contraste, foco e alvos de interação devem funcionar por
  teclado e em diferentes larguras de tela.
- R12. Tabelas e ações existentes devem continuar utilizáveis dentro do novo
  shell sem perda funcional.

## Acceptance Examples

- AE1. **Covers R4, R6.** Dado um usuário em uma tela grande, quando ele abre o
  sistema, então vê o menu expandido e identifica claramente o módulo ativo.
- AE2. **Covers R4, R7.** Dado um usuário em celular, quando ele abre a
  navegação, então acessa os módulos permitidos por uma gaveta que pode fechar.
- AE3. **Covers R5.** Dado um consultor autenticado, quando ele navega pelo
  sistema, então não vê a área de Administração.
- AE4. **Covers R8, R10.** Dado um banco sem registros, quando o dashboard
  carrega, então mostra valores reais zerados e não apresenta dados fictícios.
- AE5. **Covers R12.** Dado um usuário em uma lista existente, quando usa busca,
  ordenação, paginação ou exportação, então o fluxo continua funcionando dentro
  do novo shell.

## Scope Boundaries

### Deferred for later

- Redesenho profundo de cada formulário, lista e tela de detalhes.
- Indicadores individuais, por grupo de pesquisa e comparativos com o IMT.
- Novas visualizações dependentes de Google Scholar ou grupos de pesquisa.

### Outside this delivery

- Alterações em regras de negócio, permissões, autenticação ou banco de dados.
- Dados simulados para preencher dashboards.

## Success Criteria

- Usuários identificam a página atual e os módulos disponíveis imediatamente.
- A navegação permanece funcional em desktop, notebook e celular.
- O sistema transmite identidade institucional e suporta uso administrativo
  frequente sem sacrificar legibilidade.
- Nenhum fluxo existente perde funcionalidade por causa da reformulação.

## Sources / Research

- `docs/brainstorms/2026-06-06-sgppf-rebuild-requirements.md`
- `docs/plans/2026-06-06-001-feat-sgppf-rebuild-plan.md`
- `docs/requisitos.tex`
- `web/src/app/(app)/layout.tsx`
- `web/src/app/(app)/dashboard/page.tsx`
