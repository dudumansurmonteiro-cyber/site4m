import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const CATEGORIAS = [
  'Edifícios',
  'Loteamentos',
  'Terrenos',
  'Geração',
  'Transmissão',
  'Ensino',
  'Financeiro',
] as const;

const projetos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projetos' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      slug: z.string(),
      setor: z.enum(['imobiliario', 'energia', 'educacao', 'financeiro']),
      // Salma Tower aparece em Edifícios e Terrenos (CLAUDE.md, seção 3),
      // por isso lista — os demais projetos têm uma única categoria.
      categorias: z.array(z.enum(CATEGORIAS)).nonempty(),
      tipo: z.string().optional(),
      localizacao: z.string().optional(),
      stats: z.array(z.object({ label: z.string(), valor: z.string() })).default([]),
      imagem: image(),
      imagemAlt: z.string(),
      /** 'cobrir' = foto em tela cheia; 'conter' = logomarca centrada em painel. */
      imagemModo: z.enum(['cobrir', 'conter']).default('cobrir'),
      descricao: z.string().optional(),
      ordem: z.number().default(99),
    }),
});

export const collections = { projetos };
