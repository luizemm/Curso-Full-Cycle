import ProductRepository from "../../../domain/product/repository/product-interface.repository"
import { ERROR_MESSAGES } from "../../../error/error.messages"
import NotFoundError from "../../../error/not-found.error"
import UseCase from "../../usecase-interface"
import {
    InputUpdateProductDto,
    OutputUpdateProductDto,
} from "./update.product.dto"
import UpdateProductMapper from "./update.product.mapper"

export default class UpdateProductUseCase
    implements UseCase<InputUpdateProductDto, OutputUpdateProductDto>
{
    private readonly productRepository: ProductRepository

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async execute(
        input: InputUpdateProductDto
    ): Promise<OutputUpdateProductDto> {
        const product = await this.productRepository.find(input.id)

        if (!product) throw new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND)

        product.changeName(input.name)
        product.changePrice(input.price)

        await this.productRepository.update(product)

        return UpdateProductMapper.toOutput(product)
    }
}
