import { Sequelize } from "sequelize-typescript"
import ProductAdmFacadeFactory from "../factory/facade.factory"
import { ProductModel } from "../repository/product.model"
import {
    AddProductFacadeInputDto,
    CheckStockFacadeInputDto,
    CheckStockFacadeOutputDto,
} from "./product-adm.facade.dto"
import { ERROR_MESSAGES } from "../util/message/error.messages"

describe("Product Adm Facade integration test", () => {
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
        const facade = ProductAdmFacadeFactory.create()

        const input: AddProductFacadeInputDto = {
            id: "1",
            name: "Product 1",
            description: "Description",
            purchasePrice: 10,
            stock: 10,
        }

        await facade.addProduct(input)

        const productDb = await ProductModel.findOne({
            where: { id: input.id },
        })

        expect(input).toStrictEqual({
            id: productDb!.id,
            name: productDb!.name,
            description: productDb!.description,
            purchasePrice: productDb!.purchasePrice,
            stock: productDb!.stock,
        } as AddProductFacadeInputDto)
    })

    it("should get stock of a product", async () => {
        const facade = ProductAdmFacadeFactory.create()

        const product = {
            id: "1",
            name: "Product 1",
            description: "Description",
            purchasePrice: 100,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await ProductModel.create(product)

        const input: CheckStockFacadeInputDto = {
            productId: product.id,
        }

        const result = await facade.checkStock(input)

        expect(result).toStrictEqual({
            productId: input.productId,
            stock: product.stock,
        } as CheckStockFacadeOutputDto)
    })

    it("should throw an error when does not find a product with the given id", async () => {
        await expect(async () => {
            const facade = ProductAdmFacadeFactory.create()

            const input: CheckStockFacadeInputDto = {
                productId: "1",
            }

            await facade.checkStock(input)
        }).rejects.toThrow(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
    })
})
