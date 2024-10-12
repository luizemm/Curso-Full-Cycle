import ProductType from "../../../../domain/product/enum/product-type.enum"
import ProductFactory from "../../../../domain/product/factory/product.factory"
import { ERROR_MESSAGES } from "../../../../error/error.messages"
import NotFoundError from "../../../../error/not-found.error"
import DatabaseTable from "../../../../infrastructure/@shared/repository/tables.enum"
import ProductRepositoryImpl from "../../../../infrastructure/product/repository/sequelize/product.repository"
import {
    InputFindProductDto,
    OutputFindProductDto,
} from "../../../../usecase/product/find/find.product.dto"
import FindProductUseCase from "../../../../usecase/product/find/find.product.usecase"
import {
    createDbInstance,
    DatabaseTestConfig,
} from "../../../@config/database/database.test.config"

const product = ProductFactory.create(ProductType.PRODUCT_A, "Product 1", 20)

const input: InputFindProductDto = {
    id: product.id,
}

describe("Integration test find product test", () => {
    let db: DatabaseTestConfig

    beforeEach(async () => {
        db = createDbInstance([DatabaseTable.PRODUCT])
        await db.init()
    })

    afterEach(async () => {
        await db.close()
    })

    it("should find a product by id", async () => {
        const productRepository = new ProductRepositoryImpl()
        const useCase = new FindProductUseCase(productRepository)

        await productRepository.create(product)

        const output = await useCase.execute(input)

        expect(output).toStrictEqual({
            id: product.id,
            name: product.name,
            price: product.price,
        } as OutputFindProductDto)
    })

    it("should throw error when not find a product with given id", async () => {
        await expect(async () => {
            const productRepository = new ProductRepositoryImpl()
            const useCase = new FindProductUseCase(productRepository)

            await useCase.execute(input)
        }).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND))
    })
})
