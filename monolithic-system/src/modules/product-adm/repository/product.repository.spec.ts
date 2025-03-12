import { Sequelize } from "sequelize-typescript"
import ProductModel from "./product.model"
import Product from "../domain/product.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import ProductRepository from "./product.repository"

describe("Product repository test", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([ProductModel])
        await sequelize.sync()

        jest.useFakeTimers()
    })

    afterEach(async () => {
        await sequelize.close()
        jest.useRealTimers()
    })

    it("should create a product", async () => {
        const product = new Product({
            id: new Id("1"),
            name: "Product 1",
            description: "Description",
            purchasePrice: 100,
            stock: 10,
        })

        const repository = new ProductRepository()
        await repository.add(product)

        const productDb = await ProductModel.findOne({
            where: { id: product.id!.id },
        })

        const dateNow = new Date()

        expect({
            id: productDb!.id,
            name: productDb!.name,
            description: productDb!.description,
            purchasePrice: productDb!.purchasePrice,
            stock: productDb!.stock,
            createdAt: productDb!.createdAt,
            updatedAt: productDb!.updatedAt,
        }).toStrictEqual({
            id: product.id!.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            stock: product.stock,
            createdAt: dateNow,
            updatedAt: dateNow,
        })
    })

    it("should find a product by id", async () => {
        const repository = new ProductRepository()

        const dateNow = new Date()

        const product = {
            id: "1",
            name: "Product 1",
            description: "Description",
            purchasePrice: 100,
            stock: 10,
            createdAt: dateNow,
            updatedAt: dateNow,
        }

        await ProductModel.create({
            ...product,
            salesPrice: product.purchasePrice,
        })

        const productDb = await repository.find(product.id)

        expect({
            id: productDb.id!.id,
            name: productDb.name,
            description: productDb.description,
            purchasePrice: productDb.purchasePrice,
            stock: productDb.stock,
            createdAt: productDb.createdAt,
            updatedAt: productDb.updatedAt,
        }).toStrictEqual(product)
    })
})
