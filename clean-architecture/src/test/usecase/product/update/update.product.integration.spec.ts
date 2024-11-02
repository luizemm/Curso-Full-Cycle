import ProductType from "../../../../domain/product/enum/product-type.enum"
import ProductFactory from "../../../../domain/product/factory/product.factory"
import { ERROR_MESSAGES } from "../../../../error/error.messages"
import NotFoundError from "../../../../error/not-found.error"
import DatabaseTable from "../../../../infrastructure/@shared/repository/tables.enum"
import ProductRepositoryImpl from "../../../../infrastructure/product/repository/sequelize/product.repository"
import {
    InputUpdateProductDto,
    OutputUpdateProductDto,
} from "../../../../usecase/product/update/update.product.dto"
import UpdateProductUseCase from "../../../../usecase/product/update/update.product.usecase"
import { createDbInstance } from "../../../@config/database/database.test.config"
import Database from "../../../../infrastructure/database/database-interface"

const product = ProductFactory.create(ProductType.PRODUCT_A, "Product 1", 100)

let input: InputUpdateProductDto

describe("Integration test update product", () => {
    let db: Database

    beforeEach(async () => {
        db = createDbInstance([DatabaseTable.PRODUCT])
        await db.init()

        input = {
            id: product.id,
            name: "updated name",
            price: 50,
        }
    })

    afterEach(async () => {
        await db.close()
    })

    it("should update a product", async () => {
        const productRepository = new ProductRepositoryImpl()
        const useCase = new UpdateProductUseCase(productRepository)

        await productRepository.create(product)

        const output = await useCase.execute(input)
        const productDb = await productRepository.find(product.id)

        expect(output).toStrictEqual({
            id: input.id,
            name: input.name,
            price: input.price,
        } as OutputUpdateProductDto)

        expect({
            id: productDb!.id,
            name: productDb!.name,
            price: productDb!.price,
        } as InputUpdateProductDto).toStrictEqual(input)
    })

    it("should throw error when not find product with given id", async () => {
        const productRepository = new ProductRepositoryImpl()
        await expect(async () => {
            const useCase = new UpdateProductUseCase(productRepository)

            await useCase.execute(input)
        }).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND))

        const productDb = await productRepository.find(product.id)

        expect(productDb).toBeNull()
    })

    it("should throw error when name is missing", async () => {
        const productRepository = new ProductRepositoryImpl()
        await expect(async () => {
            const useCase = new UpdateProductUseCase(productRepository)

            await productRepository.create(product)

            input.name = ""

            await useCase.execute(input)
        }).rejects.toThrow(
            new NotFoundError(ERROR_MESSAGES.REQUIRED_FIELD.NAME)
        )

        const productDb = await productRepository.find(product.id)

        expect(productDb).toStrictEqual(product)
    })

    it("should throw error when price is less than zero", async () => {
        const productRepository = new ProductRepositoryImpl()
        await expect(async () => {
            const useCase = new UpdateProductUseCase(productRepository)

            await productRepository.create(product)

            input.price = -20

            await useCase.execute(input)
        }).rejects.toThrow(
            new NotFoundError(ERROR_MESSAGES.PRICE_MUST_BE_GREATER_EQUAL_ZERO)
        )

        const productDb = await productRepository.find(product.id)

        expect(productDb).toStrictEqual(product)
    })
})
