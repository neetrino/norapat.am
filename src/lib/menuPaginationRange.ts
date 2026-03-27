export type PaginationItem = number | 'ellipsis'

/**
 * Էջերի համարներ + «…» երկար ցուցակի համար (մենյուի էջավորում)։
 */
export function getMenuPaginationItems(
  currentPage: number,
  totalPages: number
): PaginationItem[] {
  if (totalPages <= 1) {
    return [1]
  }
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const delta = 2
  const items: PaginationItem[] = []
  const pushRange = (from: number, to: number) => {
    for (let p = from; p <= to; p += 1) {
      items.push(p)
    }
  }

  items.push(1)
  const left = Math.max(2, currentPage - delta)
  const right = Math.min(totalPages - 1, currentPage + delta)

  if (left > 2) {
    items.push('ellipsis')
  }
  pushRange(left, right)
  if (right < totalPages - 1) {
    items.push('ellipsis')
  }
  items.push(totalPages)

  return items
}
