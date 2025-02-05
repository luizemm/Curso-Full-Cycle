import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase.interface"
import FindProductUseCase from "../usecase/find-product/find-product.usecase.interface"
import {
    FindStoreCatalogFacadeInputDto,
    FindStoreCatalogFacadeOutputDto,
    FindAllStoreCatalogFacadeOutputDto,
} from "./store-catalog.facade.dto"
import StoreCatalogFacade from "./store-catalog.facade.interface"

export interface UseCaseProps {
    findUseCase: FindProductUseCase
    findAllUseCase: FindAllProductsUseCase
}

export default class StoreCatalogFacadeImpl implements StoreCatalogFacade {
    private readonly _findUseCase: FindProductUseCase
    private readonly _findAllUseCase: FindAllProductsUseCase

    constructor(props: UseCaseProps) {
        this._findUseCase = props.findUseCase
        this._findAllUseCase = props.findAllUseCase
    }

    async find(
        id: FindStoreCatalogFacadeInputDto
    ): Promise<FindStoreCatalogFacadeOutputDto> {
        return await this._findUseCase.execute(id)
    }
    async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
        return await this._findAllUseCase.execute()
    }
}
