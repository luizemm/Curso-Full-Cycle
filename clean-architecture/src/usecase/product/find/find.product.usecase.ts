import ProductRepository from "../../../domain/product/repository/product-interface.repository"
import { ERROR_MESSAGES } from "../../../error/error.messages"
import NotFoundError from "../../../error/not-found.error"
import UseCase from "../../usecase-interface"
import { InputFindProductDto, OutputFindProductDto } from "./find.product.dto"
import FindProductMapper from "./find.product.mapper"

export default class FindProductUseCase
    implements UseCase<InputFindProductDto, OutputFindProductDto>
{
    private readonly productRepository: ProductRepository

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async execute(input: InputFindProductDto): Promise<OutputFindProductDto> {
        const product = await this.productRepository.find(input.id)

        if (!product)
            throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, {
                context: input.id,
            })

        return FindProductMapper.toOutput(product)
    }
}
