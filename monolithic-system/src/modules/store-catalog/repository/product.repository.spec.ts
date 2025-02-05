import { Sequelize } from "sequelize-typescript"
import ProductGateway from "../gateway/product.gateway"
import { ERROR_MESSAGES } from "../util/message/error.messages"
import ProductModel from "./product.model"
import ProductRepository from "./product.repository"

describe("Product repository integration tests", () => {
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
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should find all products", async () => {
        const products = [
            {
                id: "1",
                name: "Product 1",
                description: "Description 1",
                salesPrice: 10,
            },
            {
                id: "2",
                name: "Product 2",
                description: "Description 2",
                salesPrice: 35,
            },
        ]

        await Promise.all(
            products.map(async product => {
                await ProductModel.create(product)
            })
        )

        const productRepository: ProductGateway = new ProductRepository()
        const result = await productRepository.findAll()

        expect(result.length).toBe(2)
        expect(
            result.map(product => ({
                id: product.id!.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            }))
        ).toStrictEqual(products)
    })

    it("should find a product by id", async () => {
        const product = {
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 10,
        }

        await ProductModel.create(product)

        const productRepository: ProductGateway = new ProductRepository()
        const result = await productRepository.find(product.id)

        expect({
            id: result.id!.id,
            name: result.name,
            description: result.description,
            salesPrice: result.salesPrice,
        }).toStrictEqual(product)
    })

    it("should throw an error when product is not found", async () => {
        const productRepository: ProductGateway = new ProductRepository()

        await expect(productRepository.find("1")).rejects.toThrow(
            ERROR_MESSAGES.PRODUCT_NOT_FOUND
        )
    })
})
