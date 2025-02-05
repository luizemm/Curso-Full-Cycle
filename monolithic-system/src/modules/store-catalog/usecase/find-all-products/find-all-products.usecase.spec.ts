import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import ProductGateway from "../../gateway/product.gateway"
import FindAllProductsUseCaseImpl from "./find-all-products.usecase"

const product = new Product({
    id: new Id("1"),
    name: "Product 1",
    description: "Description 1",
    salesPrice: 10,
})

const product2 = new Product({
    id: new Id("2"),
    name: "Product 2",
    description: "Description 2",
    salesPrice: 35,
})

const products = [product, product2]

const createMockRepository = (): jest.Mocked<ProductGateway> => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockResolvedValue([product, product2]),
    }
}

describe("Find all products use case unit tests", () => {
    it("should return all products", async () => {
        const productRepository = createMockRepository()
        const findAllProductsUseCase = new FindAllProductsUseCaseImpl(
            productRepository
        )

        const result = await findAllProductsUseCase.execute()

        expect(productRepository.findAll).toHaveBeenCalled()
        expect(result.products.length).toBe(2)
        expect(result.products).toStrictEqual(
            products.map(product => ({
                id: product.id!.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            }))
        )
    })
})
