import { inject, injectable } from "inversify"
import ProductRepository from "../../../domain/product/repository/product-interface.repository"
import UseCase from "../../usecase-interface"
import { InputListProductDto, OutputListProductDto } from "./list.product.dto"
import ListProductMapper from "./list.product.mapper"
import TYPES from "../../../infrastructure/dependency-injection/dependency.types"

@injectable()
export default class ListProductUseCase
    implements UseCase<InputListProductDto, OutputListProductDto>
{
    private readonly productRepository: ProductRepository

    constructor(
        @inject(TYPES.ProductRepository) productRepository: ProductRepository
    ) {
        this.productRepository = productRepository
    }

    async execute(_input: InputListProductDto): Promise<OutputListProductDto> {
        const products = await this.productRepository.findAll()

        return ListProductMapper.toOutput(products)
    }
}
