import { Sequelize } from "sequelize-typescript"
import StoreCatalogFacadeFactory from "../factory/store-catalog.facade.factory"
import ProductModel from "../repository/product.model"
import { ERROR_MESSAGES } from "../util/message/error.messages"
import StoreCatalogFacade from "./store-catalog.facade.interface"

describe("Store catalog integration tests", () => {
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

    it("should find a product by id", async () => {
        const product = {
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 10,
        }

        await ProductModel.create(product)

        const storeCatalogFacade: StoreCatalogFacade =
            StoreCatalogFacadeFactory.create()

        const result = await storeCatalogFacade.find({ id: product.id })

        expect({
            id: result.id,
            name: result.name,
            description: result.description,
            salesPrice: result.salesPrice,
        }).toStrictEqual(product)
    })

    it("should throw an error when product is not found", async () => {
        const storeCatalogFacade: StoreCatalogFacade =
            StoreCatalogFacadeFactory.create()

        await expect(storeCatalogFacade.find({ id: "1" })).rejects.toThrow(
            ERROR_MESSAGES.PRODUCT_NOT_FOUND
        )
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

        const storeCatalogFacade: StoreCatalogFacade =
            StoreCatalogFacadeFactory.create()
        const result = await storeCatalogFacade.findAll()

        expect(result.products.length).toBe(2)
        expect(
            result.products.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            }))
        ).toStrictEqual(products)
    })
})
