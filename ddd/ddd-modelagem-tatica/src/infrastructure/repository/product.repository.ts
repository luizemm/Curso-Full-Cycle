import Product from "../../domain/entity/product"
import ProductRepository from "../../domain/repository/product-interface.repository"
import ProductModel from "../db/sequelize/model/product.model"

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

        return new Product(
            productModel.id,
            productModel.name,
            productModel.price
        )
    }
    async findAll(): Promise<Product[]> {
        const products = await ProductModel.findAll()
        return products.map(
            product => new Product(product.id, product.name, product.price)
        )
    }
}
