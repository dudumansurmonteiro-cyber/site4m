/**
 * As 4 frentes do Grupo 4M — a "malha 4M" (CLAUDE.md, seção 7).
 * Toda a copy vem das seções 4.2 a 4.6 e deve ser usada exatamente como está.
 *
 * Imagens dos cards/impacto: enquanto não chegam fotos dedicadas de cada
 * setor, usamos as imagens reais já enviadas pelo cliente (fotos dos
 * projetos e logomarcas — estas exibidas em modo "conter").
 */
import type { ImageMetadata } from 'astro';

import fotoMuse from '../assets/projetos/muse.jpg';
import fotoSalma from '../assets/projetos/salma-tower.jpg';
import fotoBosque from '../assets/projetos/bosque-ipiranga.webp';
import fotoUnieduk from '../assets/projetos/unieduk-campus.jpg';
import marcaSuape from '../assets/projetos/suape.webp';

import { DESCRICOES, rota } from './site';

export type SetorId = 'imobiliario' | 'energia' | 'educacao' | 'financeiro';

export type ModoImagem = 'cobrir' | 'conter';

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
  imagemCardModo?: ModoImagem;
  imagemImpacto: ImageMetadata;
  imagemImpactoModo?: ModoImagem;
  altCard: string;
  altImpacto: string;
}

export const SETORES: Setor[] = [
  {
    id: 'imobiliario',
    indice: '01',
    nome: 'Imobiliário',
    href: rota('/imobiliario/'),
    textoHome:
      'Planejamos, investimos, desenvolvemos e gerenciamos empreendimentos residenciais, comerciais e loteamentos urbanos, com foco em urbanização planejada, qualidade construtiva e geração de valor no longo prazo.',
    intro2:
      'Projetos como Salma Tower, Alphagran e Muse Itaim refletem nossa capacidade de identificar localizações estratégicas, estruturar produtos imobiliários alinhados à demanda do mercado e entregar empreendimentos com alto potencial de valorização e liquidez — contribuindo para a transformação positiva das cidades onde atuamos.',
    metaDescription: DESCRICOES.imobiliario,
    categorias: ['Edifícios', 'Loteamentos', 'Terrenos'],
    imagemCard: fotoMuse,
    imagemImpacto: fotoBosque,
    altCard: 'Fachada do edifício Muse Itaim, torre com jardins verticais',
    altImpacto: 'Vista aérea dos edifícios do Bosque Ipiranga cercados de área verde',
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
    imagemCard: marcaSuape,
    imagemCardModo: 'conter',
    imagemImpacto: marcaSuape,
    imagemImpactoModo: 'conter',
    altCard: 'Logomarca da Suape Energia',
    altImpacto: 'Logomarca da Suape Energia',
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
    imagemCard: fotoUnieduk,
    imagemImpacto: fotoUnieduk,
    altCard: 'Prédio da UniEduk — Centro Escola de Especialidades Médicas',
    altImpacto: 'Prédio da UniEduk — Centro Escola de Especialidades Médicas',
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
    imagemCard: fotoSalma,
    imagemImpacto: fotoSalma,
    altCard: 'Salma Tower, sede do Banco Industrial do Brasil',
    altImpacto: 'Salma Tower, sede do Banco Industrial do Brasil, em São Paulo',
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
