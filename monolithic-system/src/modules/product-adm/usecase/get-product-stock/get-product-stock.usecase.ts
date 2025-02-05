import ProductRepository from "../../repository/product.repository"
import {
    GetProductStockInputDto,
    GetProductStockOutputDto,
} from "./get-product-stock.dto"
import GetProductStockUseCase from "./get-product-stock.usecase.interface"

export default class GetProductStockUseCaseImpl
    implements GetProductStockUseCase
{
    private readonly productRepository: ProductRepository

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async execute(
        input: GetProductStockInputDto
    ): Promise<GetProductStockOutputDto> {
        const product = await this.productRepository.find(input.productId)

        return {
            productId: product.id!.id,
            stock: product.stock,
        }
    }
}
