#!/usr/bin/env node
/**
 * Build script – Clean Architecture
 * Reads data/site.json, templates/, and pages/, outputs static HTML to repo root.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname);
const DATA_DIR = path.join(ROOT, 'data');
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const PAGES_DIR = path.join(ROOT, 'pages');
const OUT_DIR = ROOT;

const site = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'site.json'), 'utf8'));

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function renderNav(activeId) {
  return site.nav
    .map(
      (item) =>
        `<li class="nav-item"><a class="nav-link${item.id === activeId ? ' active' : ''}" href="${item.href}">${item.label}</a></li>`
    )
    .join('\n                ');
}

const pages = [
  {
    id: 'index',
    output: 'index.html',
    title: 'Vertebralis – Coluna & Dor',
    description:
      'Clínica Vertebralis – Coluna & Dor em Timóteo, MG. Quiropraxia, Acupuntura, Pilates, Ozonioterapia e recuperação esportiva. Agende sua avaliação.',
    bodyClass: 'page-with-fixed-nav',
    navClass: 'fixed-top',
    footerMargin: 'mt-0',
    contentPath: path.join(PAGES_DIR, 'index.html'),
    injectData: false,
  },
  {
    id: 'servicos',
    output: 'servicos.html',
    title: 'Serviços – Vertebralis',
    description:
      'Serviços da Clínica Vertebralis: Quiropraxia, Acupuntura, Pilates, Ozonioterapia, Recuperação Esportiva, Fisioterapia e Terapia Ocupacional.',
    bodyClass: '',
    navClass: '',
    footerMargin: 'mt-5',
    contentPath: path.join(PAGES_DIR, 'servicos.html'),
    injectData: false,
  },
  {
    id: 'equipe',
    output: 'equipe.html',
    title: 'Equipe – Vertebralis',
    description:
      'Conheça a equipe multidisciplinar da Vertebralis: quiropraxia, acupuntura e Pilates em Timóteo, MG.',
    bodyClass: '',
    navClass: '',
    footerMargin: 'mt-5',
    contentPath: path.join(PAGES_DIR, 'equipe.html'),
    injectData: false,
  },
  {
    id: 'contato',
    output: 'contato.html',
    title: 'Contato – Vertebralis',
    description:
      'Entre em contato com a Clínica Vertebralis em Timóteo, MG. Endereço, telefones e e-mail para agendamento.',
    bodyClass: '',
    navClass: '',
    footerMargin: 'mt-5',
    contentPath: path.join(PAGES_DIR, 'contato.html'),
    injectData: true,
  },
];

const headTpl = read(path.join(TEMPLATES_DIR, 'head.html'));
const navTpl = read(path.join(TEMPLATES_DIR, 'nav.html'));
const footerTpl = read(path.join(TEMPLATES_DIR, 'footer.html'));

const c = site.contact;
const contactReplacements = {
  cnpj: c.cnpj,
  razaoSocial: c.razaoSocial,
  address: `${c.address.street}<br>${c.address.neighborhood}, ${c.address.city}<br>CEP ${c.address.cep}`,
  phones: c.phones
    .map((p) => `<a class="tel-link" href="tel:${p.tel}">${p.display}</a>`)
    .join('<br>'),
  email: `<a class="mail-link" href="mailto:${c.email}">${c.email}</a>`,
  cadastral: `Situação Cadastral: ${c.situacaoCadastral}<br>Abertura: ${c.abertura}<br>Porte: ${c.porte}`,
  mapEmbedUrl: c.mapEmbedUrl,
  mapTitle: c.mapTitle,
};

pages.forEach((page) => {
  let mainContent = read(page.contentPath);
  if (page.injectData) {
    Object.entries(contactReplacements).forEach(([key, value]) => {
      mainContent = mainContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
  }

  const head = headTpl
    .replace('{{title}}', page.title)
    .replace('{{description}}', page.description);

  const nav = navTpl
    .replace('{{logoAlt}}', site.site.logoAlt)
    .replace('{{navClass}}', page.navClass ? `shadow-sm ${page.navClass}` : 'shadow-sm')
    .replace('{{navItems}}', renderNav(page.id));

  const footer = footerTpl
    .replace('{{footerMargin}}', page.footerMargin)
    .replace('{{footerText}}', site.footer.text);

  const html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    ${head}
</head>

<body${page.bodyClass ? ` class="${page.bodyClass}"` : ''}>

${nav}

${mainContent}

${footer}
</body>
</html>
`;

  write(path.join(OUT_DIR, page.output), html);
  console.log('Generated:', page.output);
});

console.log('Build complete.');
