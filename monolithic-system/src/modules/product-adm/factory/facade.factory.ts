import ProductAdmFacadeImpl from "../facade/product-adm.facade"
import ProductRepository from "../repository/product.repository"
import AddProductUseCaseImpl from "../usecase/add-product/add-product.usecase"
import GetProductStockUseCaseImpl from "../usecase/get-product-stock/get-product-stock.usecase"

export default class ProductAdmFacadeFactory {
    static create() {
        const productRepository = new ProductRepository()
        const addProductUseCase = new AddProductUseCaseImpl(productRepository)
        const getProductStockUseCase = new GetProductStockUseCaseImpl(
            productRepository
        )

        return new ProductAdmFacadeImpl({
            addProductUseCase,
            getProductStockUseCase,
        })
    }
}
