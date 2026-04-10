import type { CategoryWithCount } from '@/types'
import { getCategoryNavImageSrc } from '@/constants/categoryNavImage.constants'

export function normalizeCategoryWithCount(category: CategoryWithCount): CategoryWithCount {
  return {
    ...category,
    image: getCategoryNavImageSrc(category.name),
  }
}

