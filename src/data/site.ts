/** Dados institucionais oficiais (CLAUDE.md, seções 4.1 e 9). */

export const NOME = 'Grupo 4M';
export const URL_SITE = 'https://www.grupo4m.com';
export const TAGLINE = 'Grupo privado de investimentos e operações';

export const TELEFONE = {
  display: '(11) 3049 9700',
  href: 'tel:+551130499700',
  e164: '+55-11-3049-9700',
};

export const ENDERECO = {
  linha1: 'Av. Pres. Juscelino Kubitschek, 1703 | 1º Andar',
  linha2: 'Vila Nova Conceição — São Paulo/SP | Brasil',
  maps:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Av. Pres. Juscelino Kubitschek, 1703, São Paulo - SP'),
};

export interface ItemMenu {
  rotulo: string;
  href: string;
}

export const MENU: ItemMenu[] = [
  { rotulo: 'Imobiliário', href: '/imobiliario/' },
  { rotulo: 'Energia', href: '/energia/' },
  { rotulo: 'Educação', href: '/educacao/' },
  { rotulo: 'Financeiro', href: '/financeiro/' },
  { rotulo: 'Quem somos', href: '/quem-somos/' },
  { rotulo: 'Contato', href: '/contato/' },
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
    'Fale com o Grupo 4M. Av. Pres. Juscelino Kubitschek, 1703, São Paulo/SP — (11) 3049 9700.',
} as const;
