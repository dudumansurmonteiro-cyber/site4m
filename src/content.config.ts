import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projetos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projetos' }),
  schema: z.object({
    titulo: z.string(),
    slug: z.string(),
    setor: z.enum(['imobiliario', 'energia', 'educacao', 'financeiro']),
    categoria: z.enum([
      'Edifícios',
      'Loteamentos',
      'Terrenos',
      'Geração',
      'Transmissão',
      'Ensino',
      'Financeiro',
    ]),
    // Salma Tower aparece em Edifícios e Terrenos com uma única página (seção 3)
    categoriaSecundaria: z
      .enum(['Edifícios', 'Loteamentos', 'Terrenos'])
      .optional(),
    tipo: z.string().optional(),
    stats: z
      .array(z.object({ label: z.string(), valor: z.string() }))
      .default([]),
    imagem: z.string(),
    descricao: z.string().default(''),
    // ordem de exibição dentro da categoria
    ordem: z.number().default(99),
    // dados ainda não extraídos do site atual (rede bloqueada) — ver seção 4.9
    dadosPendentes: z.boolean().default(false),
  }),
});

export const collections = { projetos };
