import ProductType from "../../../../domain/product/enum/product-type.enum"
import ProductFactory from "../../../../domain/product/factory/product.factory"
import ProductRepository from "../../../../domain/product/repository/product-interface.repository"
import { ERROR_MESSAGES } from "../../../../error/error.messages"
import NotFoundError from "../../../../error/not-found.error"
import {
    InputFindProductDto,
    OutputFindProductDto,
} from "../../../../usecase/product/find/find.product.dto"
import FindProductUseCase from "../../../../usecase/product/find/find.product.usecase"

const product = ProductFactory.create(ProductType.PRODUCT_A, "Product 1", 20)

const input: InputFindProductDto = {
    id: product.id,
}

const mockRepository: jest.Mocked<ProductRepository> = {
    create: jest.fn(),
    find: jest.fn().mockResolvedValue(product),
    findAll: jest.fn(),
    update: jest.fn(),
}

describe("Unit test find product test", () => {
    it("should find a product by id", async () => {
        const useCase = new FindProductUseCase(mockRepository)

        const output = await useCase.execute(input)

        expect(output).toStrictEqual({
            id: product.id,
            name: product.name,
            price: product.price,
        } as OutputFindProductDto)
    })

    it("should throw error when not find a product with given id", async () => {
        await expect(async () => {
            const useCase = new FindProductUseCase(mockRepository)

            mockRepository.find.mockResolvedValueOnce(null)

            await useCase.execute(input)
        }).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND))
    })
})
