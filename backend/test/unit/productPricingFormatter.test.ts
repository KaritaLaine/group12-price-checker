import { describe, it, expect } from "vitest"
import { buildPriceView } from "../../src/utils/productPricingFormatter"

const store = (id: string, name: string) => ({
  _id: { toString: () => id },
  name,
  location: { coordinates: [24.94, 60.17] },
})

describe("buildPriceView", () => {
  it("maps prices into current and nearby stores with labels", () => {
    const product = {
      name: "Milk",
      barcode: { type: "EAN", gtin: "12345678" },
    }

    const prices = [
      { _id: { toString: () => "p1" }, price: 10, store: store("s1", "Home") },
      {
        _id: { toString: () => "p2" },
        price: 5,
        discountedPrice: 4.5,
        store: store("s2", "Nearby"),
      },
    ]

    const result = buildPriceView(product, prices, "s1")

    expect(result.manualPriceEntryRequired).toBe(false)
    expect(result.product).toEqual(product)
    expect(result.currentStore?.store.name).toBe("Home")
    expect(result.currentStore?.label).toBe("very expensive")
    expect(result.nearbyStores).toHaveLength(1)
    expect(result.nearbyStores[0].store.name).toBe("Nearby")
    expect(result.nearbyStores[0].label).toBe("very inexpensive")
  })

  it("returns null currentStore when matching store not found", () => {
    const product = { name: "Juice", barcode: { type: "EAN", gtin: "999" } }
    const prices = [{ price: 3.5, store: store("other", "Other") }]

    const result = buildPriceView(product, prices, "missing")

    expect(result.currentStore).toBeNull()
    expect(result.nearbyStores).toHaveLength(1)
  })
})
