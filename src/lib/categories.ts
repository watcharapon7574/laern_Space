import { prisma } from '@/lib/prisma'

export interface CategoryData {
  id: string
  key: string
  label: string
  slug: string
  color: string
  cssClass: string
  sortOrder: number
}

export async function getCategories(): Promise<CategoryData[]> {
  return prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getCategoryBySlug(slug: string): Promise<CategoryData | null> {
  return prisma.category.findUnique({
    where: { slug },
  })
}

export async function getCategoryById(id: string): Promise<CategoryData | null> {
  return prisma.category.findUnique({
    where: { id },
  })
}

export function buildCategoryLabelMap(categories: CategoryData[]): Record<string, string> {
  return Object.fromEntries(categories.map(c => [c.key, c.label]))
}
