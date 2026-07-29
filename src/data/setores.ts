/**
 * As 4 frentes do Grupo 4M — a "malha 4M" (CLAUDE.md, seção 7).
 * Toda a copy vem das seções 4.2 a 4.6 e deve ser usada exatamente como está.
 */
import type { ImageMetadata } from 'astro';

import setorImobiliario from '../assets/setor-imobiliario.jpg';
import setorEnergia from '../assets/setor-energia.jpg';
import setorEducacao from '../assets/setor-educacao.jpg';
import setorFinanceiro from '../assets/setor-financeiro.jpg';
import impactoImobiliario from '../assets/impacto-imobiliario.jpg';
import impactoEnergia from '../assets/impacto-energia.jpg';
import impactoEducacao from '../assets/impacto-educacao.jpg';
import impactoFinanceiro from '../assets/impacto-financeiro.jpg';

import { DESCRICOES, rota } from './site';

export type SetorId = 'imobiliario' | 'energia' | 'educacao' | 'financeiro';

export interface Setor {
  id: SetorId;
  indice: '01' | '02' | '03' | '04';
  nome: string;
  href: string;
  /** Texto do bloco da home (4.2) — também 1º parágrafo da página do setor. */
  textoHome: string;
  /** 2º parágrafo da intro da página do setor (4.3–4.6). */
  intro2: string;
  metaDescription: string;
  /** Ordem das categorias na grade de projetos (seção 3). */
  categorias: string[];
  imagemCard: ImageMetadata;
  imagemImpacto: ImageMetadata;
  altCard: string;
}

export const SETORES: Setor[] = [
  {
    id: 'imobiliario',
    indice: '01',
    nome: 'Imobiliário',
    href: rota('/imobiliario/'),
    textoHome:
      'Planejamos, investimos, desenvolvemos e gerenciamos empreendimentos residenciais, comerciais e loteamentos urbanos com foco em urbanização planejada, qualidade construtiva e geração de valor no longo prazo.',
    intro2:
      'Projetos como Izzy Campinas, Alphagran e Saint Paul refletem nossa capacidade de identificar localizações estratégicas, estruturar produtos imobiliários alinhados à demanda do mercado e entregar empreendimentos com alto potencial de valorização e liquidez, contribuindo para a transformação positiva das cidades onde atuamos.',
    metaDescription: DESCRICOES.imobiliario,
    categorias: ['Edifícios', 'Loteamentos', 'Terrenos'],
    imagemCard: setorImobiliario,
    imagemImpacto: impactoImobiliario,
    altCard: 'Empreendimento imobiliário do Grupo 4M',
  },
  {
    id: 'energia',
    indice: '02',
    nome: 'Energia',
    href: rota('/energia/'),
    textoHome:
      'Investimos e participamos de projetos de geração de energia de grande porte, como Suape Termelétrica e Guaçu, contribuindo para a segurança energética e o fortalecimento da matriz regional.',
    intro2:
      'Nossa atuação no setor é orientada por eficiência operacional, viabilidade econômica e visão de longo prazo, buscando projetos que gerem impacto positivo, estabilidade e retorno consistente.',
    metaDescription: DESCRICOES.energia,
    categorias: ['Geração', 'Transmissão'],
    imagemCard: setorEnergia,
    imagemImpacto: impactoEnergia,
    altCard: 'Infraestrutura de energia do Grupo 4M',
  },
  {
    id: 'educacao',
    indice: '03',
    nome: 'Educação',
    href: rota('/educacao/'),
    textoHome:
      'Por meio da participação no Grupo Unieduk, atuamos no desenvolvimento de soluções educacionais voltadas à formação, capacitação e especialização de profissionais, preparando talentos para um mercado cada vez mais exigente e dinâmico.',
    intro2:
      'Nosso compromisso com a educação está diretamente ligado à criação de capital humano qualificado, essencial para o crescimento sustentável dos negócios e da sociedade.',
    metaDescription: DESCRICOES.educacao,
    categorias: ['Ensino'],
    imagemCard: setorEducacao,
    imagemImpacto: impactoEducacao,
    altCard: 'Ambiente educacional do Grupo Unieduk',
  },
  {
    id: 'financeiro',
    indice: '04',
    nome: 'Financeiro',
    href: rota('/financeiro/'),
    textoHome:
      'Estruturamos e coordenamos operações financeiras, modelos de funding e soluções de capital que viabilizam, sustentam e aceleram cada uma das frentes do grupo.',
    intro2:
      'A área financeira atua como pilar estratégico do Grupo 4M, garantindo governança, eficiência na alocação de recursos e integração entre os negócios, sempre com foco em crescimento sólido e disciplinado.',
    metaDescription: DESCRICOES.financeiro,
    categorias: ['Financeiro'],
    imagemCard: setorFinanceiro,
    imagemImpacto: impactoFinanceiro,
    altCard: 'Distrito financeiro de São Paulo',
  },
];

export const SETOR_POR_ID = Object.fromEntries(SETORES.map((s) => [s.id, s])) as Record<
  SetorId,
  Setor
>;

/** Âncoras das categorias nas páginas de setor (breadcrumb dos projetos). */
export const ANCORA_CATEGORIA: Record<string, string> = {
  Edifícios: 'edificios',
  Loteamentos: 'loteamentos',
  Terrenos: 'terrenos',
  Geração: 'geracao',
  Transmissão: 'transmissao',
  Ensino: 'ensino',
  Financeiro: 'financeiro',
};
