import ProductType from "../../../../domain/product/enum/product-type.enum"
import ProductFactory from "../../../../domain/product/factory/product.factory"
import ProductRepository from "../../../../domain/product/repository/product-interface.repository"
import {
    InputListProductDto,
    OutputListProductDto,
    ProductDto,
} from "../../../../usecase/product/list/list.product.dto"
import ListProductUseCase from "../../../../usecase/product/list/list.product.usecase"

const product1 = ProductFactory.create(ProductType.PRODUCT_A, "Product 1", 12)
const product2 = ProductFactory.create(ProductType.PRODUCT_B, "Product 2", 1.23)

const products = [product1, product2]

const input: InputListProductDto = {}

const mockRepository: jest.Mocked<ProductRepository> = {
    create: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn().mockResolvedValue(products),
    update: jest.fn(),
}

describe("Unit test list product", () => {
    it("should list all products", async () => {
        const useCase = new ListProductUseCase(mockRepository)

        const output = await useCase.execute(input)

        expect(output.products.length).toBe(products.length)
        expect(output).toStrictEqual({
            products: products.map(
                product =>
                    ({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                    }) as ProductDto
            ),
        } as OutputListProductDto)
    })
})
