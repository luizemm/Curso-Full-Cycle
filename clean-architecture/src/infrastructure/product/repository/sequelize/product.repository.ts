import ProductA from "../../../../domain/product/entity/product-a"
import Product from "../../../../domain/product/entity/product-interface"
import ProductRepository from "../../../../domain/product/repository/product-interface.repository"
import ProductModel from "./product.model"

export default class ProductRepositoryImpl implements ProductRepository {
    async create(entity: Product): Promise<void> {
        await ProductModel.create({
            id: entity.id,
            name: entity.name,
            price: entity.price,
        })
    }
    async update(entity: Product): Promise<void> {
        await ProductModel.update(
            {
                name: entity.name,
                price: entity.price,
            },
            {
                where: { id: entity.id },
            }
        )
    }
    async find(id: string): Promise<Product | null> {
        const productModel = await ProductModel.findOne({ where: { id } })

        if (!productModel) return null

        return new ProductA(
            productModel.id,
            productModel.name,
            productModel.price
        )
    }
    async findAll(): Promise<Product[]> {
        const products = await ProductModel.findAll()
        return products.map(
            product => new ProductA(product.id, product.name, product.price)
        )
    }
}
