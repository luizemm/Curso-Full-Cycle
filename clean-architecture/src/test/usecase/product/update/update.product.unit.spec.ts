import ProductType from "../../../../domain/product/enum/product-type.enum"
import ProductFactory from "../../../../domain/product/factory/product.factory"
import ProductRepository from "../../../../domain/product/repository/product-interface.repository"
import { ERROR_MESSAGES } from "../../../../error/error.messages"
import NotFoundError from "../../../../error/not-found.error"
import {
    InputUpdateProductDto,
    OutputUpdateProductDto,
} from "../../../../usecase/product/update/update.product.dto"
import UpdateProductUseCase from "../../../../usecase/product/update/update.product.usecase"

const product = ProductFactory.create(ProductType.PRODUCT_A, "Product 1", 100)

let input: InputUpdateProductDto

const mockRepository: jest.Mocked<ProductRepository> = {
    create: jest.fn(),
    find: jest.fn().mockResolvedValue(product),
    findAll: jest.fn(),
    update: jest.fn(),
}

describe("Unit test update product", () => {
    beforeEach(() => {
        input = {
            id: product.id,
            name: "updated name",
            price: 50,
        }
    })

    it("should update a product", async () => {
        const useCase = new UpdateProductUseCase(mockRepository)

        const output = await useCase.execute(input)

        expect(output).toStrictEqual({
            id: input.id,
            name: input.name,
            price: input.price,
        } as OutputUpdateProductDto)
    })

    it("should throw error when not find product with given id", () => {
        expect(async () => {
            const useCase = new UpdateProductUseCase(mockRepository)

            mockRepository.find.mockResolvedValueOnce(null)

            await useCase.execute(input)
        }).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND))
    })

    it("should throw error when name is missing", () => {
        expect(async () => {
            const useCase = new UpdateProductUseCase(mockRepository)

            input.name = ""

            await useCase.execute(input)
        }).rejects.toThrow(
            new NotFoundError(ERROR_MESSAGES.REQUIRED_FIELD.NAME)
        )
    })

    it("should throw error when price is less than zero", () => {
        expect(async () => {
            const useCase = new UpdateProductUseCase(mockRepository)

            input.price = -20

            await useCase.execute(input)
        }).rejects.toThrow(
            new NotFoundError(ERROR_MESSAGES.PRICE_MUST_BE_GREATER_EQUAL_ZERO)
        )
    })
})
