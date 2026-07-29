/**
 * Dados institucionais compartilhados — copy oficial do CLAUDE.md (seção 4).
 * Não parafrasear: os textos abaixo são a copy revisada e aprovada.
 */

export const CONTATO = {
  telefone: '(11) 3049 9700',
  telefoneHref: 'tel:+551130499700',
  telefoneJsonLd: '+55-11-3049-9700',
  endereco:
    'Av. Pres. Juscelino Kubitschek, 1703 | 1º Andar — Vila Nova Conceição — São Paulo/SP | Brasil',
  enderecoPostal: {
    logradouro: 'Av. Pres. Juscelino Kubitschek, 1703, 1º Andar',
    bairro: 'Vila Nova Conceição',
    cidade: 'São Paulo',
    uf: 'SP',
    pais: 'BR',
  },
} as const;

export interface Setor {
  indice: '01' | '02' | '03' | '04';
  slug: 'imobiliario' | 'energia' | 'educacao' | 'financeiro';
  nome: string;
  /** Copy oficial da seção 4.2 — usada na home e em "O que fazemos" (Quem Somos). */
  texto: string;
  /** Ordem das categorias na grade de projetos da página do setor. */
  categorias: string[];
}

export const SETORES: Setor[] = [
  {
    indice: '01',
    slug: 'imobiliario',
    nome: 'Imobiliário',
    texto:
      'Planejamos, investimos, desenvolvemos e gerenciamos empreendimentos residenciais, comerciais e loteamentos urbanos com foco em urbanização planejada, qualidade construtiva e geração de valor no longo prazo.',
    categorias: ['Edifícios', 'Loteamentos', 'Terrenos'],
  },
  {
    indice: '02',
    slug: 'energia',
    nome: 'Energia',
    texto:
      'Investimos e participamos de projetos de geração de energia de grande porte, como Suape Termelétrica e Guaçu, contribuindo para a segurança energética e o fortalecimento da matriz regional.',
    categorias: ['Geração', 'Transmissão'],
  },
  {
    indice: '03',
    slug: 'educacao',
    nome: 'Educação',
    texto:
      'Por meio da participação no Grupo Unieduk, atuamos no desenvolvimento de soluções educacionais voltadas à formação, capacitação e especialização de profissionais, preparando talentos para um mercado cada vez mais exigente e dinâmico.',
    categorias: ['Ensino'],
  },
  {
    indice: '04',
    slug: 'financeiro',
    nome: 'Financeiro',
    texto:
      'Estruturamos e coordenamos operações financeiras, modelos de funding e soluções de capital que viabilizam, sustentam e aceleram cada uma das frentes do grupo.',
    categorias: ['Financeiro'],
  },
];

export function setorPorSlug(slug: string): Setor {
  const setor = SETORES.find((s) => s.slug === slug);
  if (!setor) throw new Error(`Setor desconhecido: ${slug}`);
  return setor;
}

/** Itens do menu principal (seção 4.1). */
export const MENU = [
  { rotulo: 'Imobiliário', href: '/imobiliario/' },
  { rotulo: 'Energia', href: '/energia/' },
  { rotulo: 'Educação', href: '/educacao/' },
  { rotulo: 'Financeiro', href: '/financeiro/' },
  { rotulo: 'Quem somos', href: '/quem-somos/' },
  { rotulo: 'Contato', href: '/contato/' },
] as const;
