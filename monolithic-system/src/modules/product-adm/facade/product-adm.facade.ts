import AddProductUseCase from "../usecase/add-product/add-product.usecase.interface"
import GetProductStockUseCase from "../usecase/get-product-stock/get-product-stock.usecase.interface"
import {
    AddProductFacadeInputDto,
    CheckStockFacadeInputDto,
    CheckStockFacadeOutputDto,
} from "./product-adm.facade.dto"
import ProductAdmFacade from "./product-adm.facade.interface"

export type UseCaseProps = {
    addProductUseCase: AddProductUseCase
    getProductStockUseCase: GetProductStockUseCase
}

export default class ProductAdmFacadeImpl implements ProductAdmFacade {
    private readonly addProductUseCase: AddProductUseCase
    private readonly getProductStockUseCase: GetProductStockUseCase

    constructor(props: UseCaseProps) {
        this.addProductUseCase = props.addProductUseCase
        this.getProductStockUseCase = props.getProductStockUseCase
    }

    async addProduct(input: AddProductFacadeInputDto): Promise<void> {
        await this.addProductUseCase.execute(input)
    }

    async checkStock(
        input: CheckStockFacadeInputDto
    ): Promise<CheckStockFacadeOutputDto> {
        return await this.getProductStockUseCase.execute(input)
    }
}
