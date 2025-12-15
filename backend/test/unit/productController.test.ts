import { describe, it, expect, vi, beforeEach } from "vitest"
import type { Request, Response } from "express"
import { productController } from "../../src/controllers/productController"
import * as pricingService from "../../src/services/productPricingService"
import * as formatter from "../../src/utils/productPricingFormatter"

vi.mock("../../src/services/productPricingService", () => ({
  findProductByBarcode: vi.fn(),
  findReferenceStore: vi.fn(),
  findNearbyStores: vi.fn(),
  findPricesForStores: vi.fn(),
}))

vi.mock("../../src/utils/productPricingFormatter", () => ({
  buildPriceView: vi.fn(),
}))

const buildContext = (overrides?: Partial<Request>) => {
  const req = {
    params: { barcode: "12345678" },
    query: { storeId: "507f1f77bcf86cd799439011", maxDistance: "2000" },
    ...overrides,
  } as Partial<Request>

  const body: any = {}
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockImplementation((data) => Object.assign(body, data)),
  } as unknown as Response

  return { req, res, body }
}

describe("productController.getProductPriceByBarcode", () => {
  const product = { _id: "product-id", name: "Milk" } as any
  const store = { _id: "store-id", location: { coordinates: [0, 0] } } as any

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("validates missing barcode", async () => {
    const { req, res, body } = buildContext({ params: {} as any })

    await productController.getProductPriceByBarcode(req as any, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(body.message).toMatch(/barcode required/i)
  })

  it("validates missing storeId", async () => {
    const { req, res, body } = buildContext({ query: {} as any })

    await productController.getProductPriceByBarcode(req as any, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(body.message).toMatch(/storeid required/i)
  })

  it("returns 404 when product is not found", async () => {
    const { req, res, body } = buildContext()
    vi.spyOn(pricingService, "findProductByBarcode").mockResolvedValue(null as any)

    await productController.getProductPriceByBarcode(req as any, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(body.message).toMatch(/product not found/i)
  })

  it("returns 404 when reference store is not found", async () => {
    const { req, res, body } = buildContext()
    vi.spyOn(pricingService, "findProductByBarcode").mockResolvedValue(product)
    vi.spyOn(pricingService, "findReferenceStore").mockResolvedValue(null as any)

    await productController.getProductPriceByBarcode(req as any, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(body.message).toMatch(/reference store not found/i)
  })

  it("returns manual entry response when no nearby stores", async () => {
    const { req, res, body } = buildContext()
    vi.spyOn(pricingService, "findProductByBarcode").mockResolvedValue(product)
    vi.spyOn(pricingService, "findReferenceStore").mockResolvedValue(store)
    vi.spyOn(pricingService, "findNearbyStores").mockResolvedValue([])

    await productController.getProductPriceByBarcode(req as any, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(body.message).toMatch(/nearby stores/i)
    expect(body.data?.manualPriceEntryRequired).toBe(true)
  })

  it("returns manual entry response when no prices", async () => {
    const { req, res, body } = buildContext()
    vi.spyOn(pricingService, "findProductByBarcode").mockResolvedValue(product)
    vi.spyOn(pricingService, "findReferenceStore").mockResolvedValue(store)
    vi.spyOn(pricingService, "findNearbyStores").mockResolvedValue([store])
    vi.spyOn(pricingService, "findPricesForStores").mockResolvedValue([])

    await productController.getProductPriceByBarcode(req as any, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(body.message).toMatch(/no prices found/i)
    expect(body.data?.manualPriceEntryRequired).toBe(true)
  })

  it("returns formatted prices when data exists", async () => {
    const { req, res, body } = buildContext()
    const formatted = { product: {}, currentStore: {}, nearbyStores: [] }
    vi.spyOn(pricingService, "findProductByBarcode").mockResolvedValue(product)
    vi.spyOn(pricingService, "findReferenceStore").mockResolvedValue(store)
    vi.spyOn(pricingService, "findNearbyStores").mockResolvedValue([store])
    vi.spyOn(pricingService, "findPricesForStores").mockResolvedValue([
      { price: 1 } as any,
    ])
    vi.spyOn(formatter, "buildPriceView").mockReturnValue(formatted as any)

    await productController.getProductPriceByBarcode(req as any, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(body.message).toMatch(/product fetched successfully/i)
    expect(body.data).toEqual(formatted)
  })
})
