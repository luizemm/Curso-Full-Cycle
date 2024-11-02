import { inject, injectable } from "inversify"
import ProductType from "../../../domain/product/enum/product-type.enum"
import ProductFactory from "../../../domain/product/factory/product.factory"
import ProductRepository from "../../../domain/product/repository/product-interface.repository"
import UseCase from "../../usecase-interface"
import {
    InputCreateProductDto,
    OutputCreateProductDto,
} from "./create.product.dto"
import CreateProductMapper from "./create.product.mapper"
import TYPES from "../../../infrastructure/dependency-injection/dependency.types"

@injectable()
export default class CreateProductUseCase
    implements UseCase<InputCreateProductDto, OutputCreateProductDto>
{
    private readonly productRepository: ProductRepository

    constructor(
        @inject(TYPES.ProductRepository) productRepository: ProductRepository
    ) {
        this.productRepository = productRepository
    }

    async execute(
        input: InputCreateProductDto
    ): Promise<OutputCreateProductDto> {
        const product = ProductFactory.create(
            ProductType.PRODUCT_A,
            input.name,
            input.price
        )

        await this.productRepository.create(product)

        return CreateProductMapper.toOutput(product)
    }
}
