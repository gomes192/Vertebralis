# Vertebralis – Coluna & Dor

Site institucional da Clínica Vertebralis (Timóteo, MG). Tratamento da coluna e dor: quiropraxia, acupuntura, Pilates, ozonioterapia e recuperação esportiva.

## Estrutura (Clean Architecture)

O projeto segue **Clean Code Architecture** com camadas bem definidas:

- **`data/site.json`** – Fonte única de dados (nav, contato, rodapé).
- **`templates/`** – Cabeçalho, navegação e rodapé reutilizáveis.
- **`pages/`** – Conteúdo principal de cada página (apenas `<main>`).
- **`css/`** – Estilos em base, componentes e layout (ver `ARCHITECTURE.md`).

Os arquivos HTML na raiz (`index.html`, `contato.html`, etc.) são **gerados** pelo script de build a partir dessas fontes.

## Como rodar

1. **Abrir o site (sem build)**  
   Abra `index.html` no navegador. Os HTML atuais na raiz continuam funcionando.

2. **Gerar o site a partir das fontes (recomendado)**  
   Instale [Node.js](https://nodejs.org/) e execute:

   ```bash
   npm run build
   ```

   Isso regera `index.html`, `contato.html`, `equipe.html` e `servicos.html` na raiz usando `data/site.json`, `templates/` e `pages/`.

## Como alterar

- **Texto do menu, contato ou rodapé** → edite `data/site.json` e rode `npm run build`.
- **Conteúdo de uma página** → edite o arquivo correspondente em `pages/` e rode `npm run build`.
- **Layout (nav/rodapé)** → edite os arquivos em `templates/`.
- **Estilos** → edite os arquivos em `css/base/`, `css/components/` ou `css/layout/`.

Detalhes da arquitetura e convenções: **[ARCHITECTURE.md](ARCHITECTURE.md)**.
