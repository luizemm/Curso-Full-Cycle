import ProductA from "../../../../domain/product/entity/product-a"
import ProductRepository from "../../../../domain/product/repository/product-interface.repository"
import { ERROR_MESSAGES } from "../../../../error/error.messages"
import {
    InputCreateProductDto,
    OutputCreateProductDto,
} from "../../../../usecase/product/create/create.product.dto"
import CreateProductUseCase from "../../../../usecase/product/create/create.product.usecase"

let input: InputCreateProductDto

const mockRepository: jest.Mocked<ProductRepository> = {
    create: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
}

describe("Unit test create product use case", () => {
    beforeEach(() => {
        input = {
            name: "Product 1",
            price: 20,
        }
    })

    it("should create a product", async () => {
        const useCase = new CreateProductUseCase(mockRepository)

        const output = await useCase.execute(input)

        expect(output).toStrictEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        } as OutputCreateProductDto)
    })

    it("should throw error when name is missing", async () => {
        await expect(async () => {
            const useCase = new CreateProductUseCase(mockRepository)

            input.name = ""

            await useCase.execute(input)
        }).rejects.toThrow(
            expect.objectContaining({
                message: `${ProductA.ERROR_CONTEXT}: ${ERROR_MESSAGES.REQUIRED_FIELD.NAME}`,
            })
        )
    })

    it("should throw error when price is less or equal zero", async () => {
        await expect(async () => {
            const customerCreateUseCase = new CreateProductUseCase(
                mockRepository
            )

            input.price = -1

            await customerCreateUseCase.execute(input)
        }).rejects.toThrow(
            expect.objectContaining({
                message: `${ProductA.ERROR_CONTEXT}: ${ERROR_MESSAGES.PRICE_MUST_BE_GREATER_EQUAL_ZERO}`,
            })
        )
    })
})
