import Product from "../models/product"
import { Request, Response } from "express"

const addProduct = async (req: Request, res: Response) => {
    try {
        const { name, barcode } = req.body

        if (!name || !barcode) {
            return res.status(400).json({ message: "Name and barcode required" });
        }

        const product = new Product({
            name: name,
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