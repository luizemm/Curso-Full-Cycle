import Product from "../../domain/product.entity"
import ProductGateway from "../../gateway/product.gateway"
import { AddProductInputDto, AddProductOutputDto } from "./add-product.dto"
import AddProductUseCaseImpl from "./add-product.usecase"

const createMockProductRepository = (): jest.Mocked<ProductGateway> => ({
    add: jest.fn().mockImplementation((product: Product) => {
        const dateNow = new Date()

        product.createdAt = dateNow
        product.updatedAt = dateNow
    }),
    find: jest.fn(),
})

describe("Add product usecase unit test", () => {
    it("should add a product", async () => {
        const productRepository = createMockProductRepository()
        const useCase = new AddProductUseCaseImpl(productRepository)

        const input: AddProductInputDto = {
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10,
        }

        jest.useFakeTimers()

        const result = await useCase.execute(input)

        const dateNow = new Date()

        expect(productRepository.add).toHaveBeenCalled()
        expect(result).toStrictEqual({
            id: expect.any(String),
            name: input.name,
            description: input.description,
            purchasePrice: input.purchasePrice,
            stock: input.stock,
            createdAt: dateNow,
            updatedAt: dateNow,
        } as AddProductOutputDto)

        jest.useRealTimers()
    })
})
