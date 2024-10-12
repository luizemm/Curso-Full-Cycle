import ProductRepository from "../../../domain/product/repository/product-interface.repository"
import UseCase from "../../usecase-interface"
import { InputListProductDto, OutputListProductDto } from "./list.product.dto"
import ListProductMapper from "./list.product.mapper"

export default class ListProductUseCase
    implements UseCase<InputListProductDto, OutputListProductDto>
{
    private readonly productRepository: ProductRepository

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async execute(_input: InputListProductDto): Promise<OutputListProductDto> {
        const products = await this.productRepository.findAll()

        return ListProductMapper.toOutput(products)
    }
}
