import StoreCatalogFacadeImpl from "../facade/store-catalog.facade"
import StoreCatalogFacade from "../facade/store-catalog.facade.interface"
import ProductRepository from "../repository/product.repository"
import FindAllProductsUseCaseImpl from "../usecase/find-all-products/find-all-products.usecase"
import FindProductUseCaseImpl from "../usecase/find-product/find-product.usecase"

export default class StoreCatalogFacadeFactory {
    static create(): StoreCatalogFacade {
        const productRepository = new ProductRepository()
        const findAllProductsUseCase = new FindAllProductsUseCaseImpl(
            productRepository
        )
        const findProductUseCase = new FindProductUseCaseImpl(productRepository)

        return new StoreCatalogFacadeImpl({
            findAllUseCase: findAllProductsUseCase,
            findUseCase: findProductUseCase,
        })
    }
}
