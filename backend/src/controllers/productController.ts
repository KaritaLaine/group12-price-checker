import Product from "../models/product"
import type { Request, Response } from "express"
import StorePrice from "../models/storePrice";

const addProduct = async (req: Request, res: Response) => {
    try {
        const { name, barcodeType, barcode, price } = req.body

        if (!name || !barcodeType || !barcode) {
            return res.status(400).json({ message: "Name, barcode type and barcode required" });
        }

        const product = new Product({
            name: name,
            barcodeType: barcodeType,
            barcode: barcode
        })

        await product.save()

        const storePrice = new StorePrice({
            productId: product._id,
            price,
            isCurrent: true
        })

        await storePrice.save()
        
        return res.status(201).json(product);

    } catch (error: any) {
        console.error(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const getProductPriceByBarcode = async (req: Request, res: Response) => {
    try {
        const { barcode } = req.params
        if (!barcode) {
            return res.status(400).json({ message: "Barcode required" })
        }

        const product = await Product.findOne({ barcode })
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const prices = await StorePrice.find({ product: product._id })

        return res.status(200).json({ product, prices })
    } catch (error: any) {
        console.error(error)
        return res.status(500).json({ message: "Server error" })
    }
}

const getProductPriceByName = async (req: Request, res: Response) => {
    try {
        const { name } = req.params
        if (!name) {
            return res.status(400).json({ message: "Name required" })
        }

        const product = await Product.findOne({ name })
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const prices = await StorePrice.find({ product: product._id })
        return res.status(200).json({ product, prices })
    } catch (error: any) {
        console.error(error)
        return res.status(500).json({ message: "Server error" })
    }
}

export const productController = {
    addProduct,
    getProductPriceByBarcode,
    getProductPriceByName
}