import Id from "../../@shared/domain/value-object/id.value-object"
import Product from "../domain/product.entity"
import ProductGateway from "../gateway/product.gateway"
import { ERROR_MESSAGES } from "../util/message/error.messages"
import ProductModel from "./product.model"

export default class ProductRepository implements ProductGateway {
    async add(product: Product): Promise<void> {
        const dateNow = new Date()

        await ProductModel.create({
            id: product.id!.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            salesPrice: product.purchasePrice,
            stock: product.stock,
            createdAt: dateNow,
            updatedAt: dateNow,
        })

        product.createdAt = dateNow
        product.updatedAt = dateNow
    }

    async find(id: string): Promise<Product> {
        const product = await ProductModel.findOne({ where: { id } })

        if (!product) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)

        return new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        })
    }
}
