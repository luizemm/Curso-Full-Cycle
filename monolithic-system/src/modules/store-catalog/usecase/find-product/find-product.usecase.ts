import ProductGateway from "../../gateway/product.gateway"
import { FindProductInputDto, FindProductOutputDto } from "./find-product.dto"
import FindProductUseCase from "./find-product.usecase.interface"

export default class FindProductUseCaseImpl implements FindProductUseCase {
    private readonly _productRepository: ProductGateway

    constructor(productRepository: ProductGateway) {
        this._productRepository = productRepository
    }

    async execute(input: FindProductInputDto): Promise<FindProductOutputDto> {
        const product = await this._productRepository.find(input.id)

        return {
            id: product.id!.id,
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        }
    }
}
