import { ERROR_MESSAGES } from "../../../../error/error.messages"
import ValidationError from "../../../../error/validation.error"
import DatabaseTable from "../../../../infrastructure/@shared/repository/tables.enum"
import ProductRepositoryImpl from "../../../../infrastructure/product/repository/sequelize/product.repository"
import {
    InputCreateProductDto,
    OutputCreateProductDto,
} from "../../../../usecase/product/create/create.product.dto"
import CreateProductUseCase from "../../../../usecase/product/create/create.product.usecase"
import { createDbInstance } from "../../../@config/database/database.test.config"
import Database from "../../../../infrastructure/database/database-interface"

let input: InputCreateProductDto

describe("Integration test create product use case", () => {
    let db: Database

    beforeEach(async () => {
        db = createDbInstance([DatabaseTable.PRODUCT])
        await db.init()

        input = {
            name: "Product 1",
            price: 20,
        }
    })

    afterEach(async () => {
        await db.close()
    })

    it("should create a product", async () => {
        const productRepository = new ProductRepositoryImpl()
        const useCase = new CreateProductUseCase(productRepository)

        const output = await useCase.execute(input)

        const productDb = await productRepository.find(output.id)

        expect(output).toStrictEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        } as OutputCreateProductDto)

        expect(productDb).not.toBeNull()
        expect({
            name: productDb!.name,
            price: productDb!.price,
        } as InputCreateProductDto)
    })

    it("should throw error when name is missing", async () => {
        const productRepository = new ProductRepositoryImpl()
        await expect(async () => {
            const useCase = new CreateProductUseCase(productRepository)

            input.name = ""

            await useCase.execute(input)
        }).rejects.toThrow(
            new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.NAME)
        )

        const products = await productRepository.findAll()

        expect(products.length).toBe(0)
    })

    it("should throw error when price is less or equal zero", async () => {
        const productRepository = new ProductRepositoryImpl()
        await expect(async () => {
            const customerCreateUseCase = new CreateProductUseCase(
                productRepository
            )

            input.price = -1

            await customerCreateUseCase.execute(input)
        }).rejects.toThrow(
            new ValidationError(ERROR_MESSAGES.PRICE_MUST_BE_GREATER_EQUAL_ZERO)
        )

        const products = await productRepository.findAll()

        expect(products.length).toBe(0)
    })
})
