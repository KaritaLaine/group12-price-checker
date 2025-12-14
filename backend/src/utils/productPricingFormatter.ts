type PriceDoc = {
  _id?: { toString(): string }
  price: number
  discountedPrice?: number
  store: any
}

type PriceEntry = {
  id?: string
  price: number
  discountedPrice?: number
  effectivePrice: number
  store: any
}

const toPriceEntries = (prices: PriceDoc[]): PriceEntry[] =>
  prices.map((priceDoc) => ({
    id: priceDoc._id?.toString(),
    price: priceDoc.price,
    discountedPrice: priceDoc.discountedPrice,
    effectivePrice: priceDoc.discountedPrice ?? priceDoc.price,
    store: priceDoc.store,
  }))

const getAveragePrice = (entries: PriceEntry[]) => {
  if (!entries.length) return 0
  const total = entries.reduce((sum, entry) => sum + entry.effectivePrice, 0)
  return total / entries.length
}

const getPriceLabel = (value: number, averagePrice: number) => {
  if (value <= averagePrice * 0.75) {
    return { label: "very inexpensive" }
  } else if (value <= averagePrice * 0.9) {
    return { label: "inexpensive" }
  } else if (value >= averagePrice * 1.25) {
    return { label: "very expensive" }
  } else if (value >= averagePrice * 1.1) {
    return { label: "expensive" }
  } else {
    return { label: "average" }
  }
}

const formatEntry = (entry: PriceEntry, averagePrice: number) => {
  const label = getPriceLabel(entry.effectivePrice, averagePrice)
  return {
    price: entry.discountedPrice ?? entry.price,
    discountedPrice: entry.discountedPrice,
    label: label.label,
    store: {
      name: (entry.store as any)?.name,
      location: (entry.store as any)?.location,
    },
  }
}

export const buildPriceView = (
  product: any,
  prices: PriceDoc[],
  currentStoreId: string
) => {
  const priceEntries = toPriceEntries(prices)
  const averagePrice = getAveragePrice(priceEntries)

  const currentStoreEntry = priceEntries.find(
    (entry) => entry.store?._id?.toString() === currentStoreId
  )

  const nearbyStores = priceEntries
    .filter((entry) => entry.store?._id?.toString() !== currentStoreId)
    .map((entry) => formatEntry(entry, averagePrice))

  const currentStore = currentStoreEntry
    ? formatEntry(currentStoreEntry, averagePrice)
    : null

  return {
    product: {
      name: product.name,
      barcode: product.barcode,
    },
    manualPriceEntryRequired: false,
    currentStore,
    nearbyStores,
  }
}
