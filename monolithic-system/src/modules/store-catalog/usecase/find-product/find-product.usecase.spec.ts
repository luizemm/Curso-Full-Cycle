import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import ProductGateway from "../../gateway/product.gateway"
import { ERROR_MESSAGES } from "../../util/message/error.messages"
import { FindProductInputDto } from "./find-product.dto"
import FindProductUseCaseImpl from "./find-product.usecase"

const product = new Product({
    id: new Id("1"),
    name: "Product 1",
    description: "Description 1",
    salesPrice: 10,
})

const createMockRepository = (): jest.Mocked<ProductGateway> => ({
    find: jest.fn().mockResolvedValue(product),
    findAll: jest.fn(),
})

describe("Find Product use case unit tests", () => {
    it("should return a product", async () => {
        const productRepository = createMockRepository()
        const findProductUseCase = new FindProductUseCaseImpl(productRepository)

        const input: FindProductInputDto = { id: "1" }

        const result = await findProductUseCase.execute(input)

        expect(productRepository.find).toHaveBeenCalled()
        expect(result).toStrictEqual({
            id: product.id!.id,
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        })
    })

    it("should throw an error if product is not found", async () => {
        const productRepository = createMockRepository()
        const findProductUseCase = new FindProductUseCaseImpl(productRepository)

        productRepository.find.mockRejectedValueOnce(
            new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
        )

        await expect(findProductUseCase.execute({ id: "1" })).rejects.toThrow(
            ERROR_MESSAGES.PRODUCT_NOT_FOUND
        )
    })
})
