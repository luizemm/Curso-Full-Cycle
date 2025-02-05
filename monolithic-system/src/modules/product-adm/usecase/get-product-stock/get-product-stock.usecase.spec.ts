import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import ProductGateway from "../../gateway/product.gateway"
import { ERROR_MESSAGES } from "../../util/message/error.messages"
import {
    GetProductStockInputDto,
    GetProductStockOutputDto,
} from "./get-product-stock.dto"
import GetProductStockUseCaseImpl from "./get-product-stock.usecase"

const product = new Product({
    id: new Id("1"),
    description: "Description",
    name: "Product 1",
    purchasePrice: 20,
    stock: 20,
})

const createMockProductRepository = (): jest.Mocked<ProductGateway> => ({
    add: jest.fn(),
    find: jest.fn().mockResolvedValue(product),
})

describe("Get product stock use case unit test", () => {
    it("should get the stock of a product", async () => {
        const productRepository = createMockProductRepository()
        const useCase = new GetProductStockUseCaseImpl(productRepository)

        const input: GetProductStockInputDto = {
            productId: product.id!.id,
        }

        const result = await useCase.execute(input)

        expect(result).toStrictEqual({
            productId: input.productId,
            stock: product.stock,
        } as GetProductStockOutputDto)
    })

    it("should throw an error when does not find a product with the given id", async () => {
        await expect(async () => {
            const productRepository = createMockProductRepository()
            const useCase = new GetProductStockUseCaseImpl(productRepository)

            productRepository.find.mockRejectedValueOnce(
                new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
            )

            const input: GetProductStockInputDto = {
                productId: "2",
            }

            await useCase.execute(input)
        }).rejects.toThrow(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
    })
})
