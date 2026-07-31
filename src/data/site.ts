/** Dados institucionais oficiais (CLAUDE.md, seções 4.1 e 9). */

const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL.slice(0, -1)
  : import.meta.env.BASE_URL;

/** Prefixa rotas internas com a base do deploy (''/ raiz em produção). */
export const rota = (caminho: string) => `${BASE}${caminho}`;

export const NOME = 'Grupo 4M';
export const URL_SITE = 'https://www.grupo4m.com';
export const TAGLINE = 'Grupo privado de investimentos e operações';

export const TELEFONE = {
  display: '(11) 3049 9700',
  href: 'tel:+551130499700',
  e164: '+55-11-3049-9700',
};

export const ENDERECO = {
  linha1: 'Av. Brigadeiro Faria Lima, 3477 | 16º Andar',
  linha2: 'São Paulo/SP | Brasil',
  maps:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Av. Brigadeiro Faria Lima, 3477, São Paulo - SP'),
};

export interface ItemMenu {
  rotulo: string;
  href: string;
}

export const MENU: ItemMenu[] = [
  { rotulo: 'Imobiliário', href: rota('/imobiliario/') },
  { rotulo: 'Energia', href: rota('/energia/') },
  { rotulo: 'Educação', href: rota('/educacao/') },
  { rotulo: 'Financeiro', href: rota('/financeiro/') },
  { rotulo: 'Quem somos', href: rota('/quem-somos/') },
  { rotulo: 'Contato', href: rota('/contato/') },
];

/** Meta descriptions exatas da seção 9. */
export const DESCRICOES = {
  home: 'Investimos e operamos negócios nos setores de energia e infraestrutura, real estate, bancos e educação. Grupo privado sediado em São Paulo.',
  imobiliario:
    'Planejamos, investimos, desenvolvemos e gerenciamos empreendimentos residenciais, comerciais e loteamentos urbanos.',
  energia:
    'Investimos e participamos de projetos de geração de energia de grande porte, como Suape Termelétrica e Guaçu.',
  educacao:
    'Por meio da participação no Grupo Unieduk, atuamos no desenvolvimento de soluções educacionais voltadas à formação, capacitação e especialização de profissionais.',
  financeiro:
    'Estruturamos e coordenamos operações financeiras, modelos de funding e soluções de capital para as frentes do grupo.',
  quemSomos:
    'Somos uma holding que reúne diferentes frentes de negócios: incorporação imobiliária, educação, energia, infraestrutura e área financeira.',
  contato:
    'Fale com o Grupo 4M. Av. Brigadeiro Faria Lima, 3477, São Paulo/SP — (11) 3049 9700.',
} as const;
