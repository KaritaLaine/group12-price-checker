import Product from "../models/product"
import { Request, Response } from "express"

const addProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, barcode } = req.body

        const product = new Product({
            name: name,
            price: Math.round(Number(price) * 100),
            barcode: barcode
        })

        await product.save()
        return res.status(201).json(product);

    } catch (error: any) {
        console.error(error);
    }
}

export const productController = {
    addProduct
}