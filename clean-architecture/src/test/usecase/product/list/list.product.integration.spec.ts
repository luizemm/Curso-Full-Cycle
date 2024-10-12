import Product from "../../../../domain/product/entity/product-interface"
import ProductType from "../../../../domain/product/enum/product-type.enum"
import ProductFactory from "../../../../domain/product/factory/product.factory"
import DatabaseTable from "../../../../infrastructure/@shared/repository/tables.enum"
import ProductRepositoryImpl from "../../../../infrastructure/product/repository/sequelize/product.repository"
import {
    InputListProductDto,
    OutputListProductDto,
    ProductDto,
} from "../../../../usecase/product/list/list.product.dto"
import ListProductUseCase from "../../../../usecase/product/list/list.product.usecase"
import {
    createDbInstance,
    DatabaseTestConfig,
} from "../../../@config/database/database.test.config"

const products = [
    ProductFactory.create(ProductType.PRODUCT_A, "Product 1", 12),
    ProductFactory.create(ProductType.PRODUCT_B, "Product 2", 1.23),
]

const input: InputListProductDto = {}

const createProduct = async (
    product: Product,
    productRepository: ProductRepositoryImpl
): Promise<void> => {
    await productRepository.create(product)
}

describe("Integration test list product", () => {
    let db: DatabaseTestConfig

    beforeEach(async () => {
        db = createDbInstance([DatabaseTable.PRODUCT])
        await db.init()
    })

    afterEach(async () => {
        await db.close()
    })

    it("should list all products", async () => {
        const productRepository = new ProductRepositoryImpl()
        const useCase = new ListProductUseCase(productRepository)

        await Promise.all(
            products.map(product => createProduct(product, productRepository))
        )

        const output = await useCase.execute(input)
        const productsDb = await productRepository.findAll()

        expect(output.products.length).toBe(productsDb.length)
        expect(output).toStrictEqual({
            products: productsDb.map(
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
