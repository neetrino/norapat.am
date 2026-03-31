/**
 * Maps admin product price form fields to API shape:
 * - list price = full price before discount (shown struck through when discount exists)
 * - discounted price = what the customer pays (optional; empty = no discount)
 */

const MIN_PRICE = 0

export type ProductPriceFormParseResult =
  | { ok: true; price: number; originalPrice: number | null }
  | { ok: false; error: string }

/**
 * Converts list + optional discounted strings into `price` and `originalPrice` for the API.
 */
export function parseProductPriceForm(
  listPriceStr: string,
  discountedPriceStr: string
): ProductPriceFormParseResult {
  const listRaw = listPriceStr.trim()
  const list = Number.parseFloat(listRaw)
  if (Number.isNaN(list) || list < MIN_PRICE) {
    return { ok: false, error: 'Մուտքագրե՛ք վավեր լիարժեք գին' }
  }

  const discRaw = discountedPriceStr.trim()
  if (!discRaw) {
    return { ok: true, price: list, originalPrice: null }
  }

  const sale = Number.parseFloat(discRaw)
  if (Number.isNaN(sale) || sale < MIN_PRICE) {
    return { ok: false, error: 'Մուտքագրե՛ք վավեր զեղչված գին կամ թողեք դատարկ' }
  }

  if (sale >= list) {
    return {
      ok: false,
      error: 'Զեղչված գինը պետք է ցածր լինի լիարժեք գնից'
    }
  }

  return { ok: true, price: sale, originalPrice: list }
}

export type ProductPriceFields = {
  listPrice: string
  discountedPrice: string
}

/**
 * Fills form fields from API product (`price` = sale, `originalPrice` = list when discount).
 */
export function productApiToPriceFormFields(product: {
  price: number
  originalPrice: number | null
}): ProductPriceFields {
  if (product.originalPrice == null) {
    return {
      listPrice: String(product.price),
      discountedPrice: ''
    }
  }
  return {
    listPrice: String(product.originalPrice),
    discountedPrice: String(product.price)
  }
}
