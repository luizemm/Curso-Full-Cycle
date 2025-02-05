import {
    AddProductFacadeInputDto,
    CheckStockFacadeInputDto,
    CheckStockFacadeOutputDto,
} from "./product-adm.facade.dto"

export default interface ProductAdmFacade {
    addProduct(input: AddProductFacadeInputDto): Promise<void>
    checkStock(
        input: CheckStockFacadeInputDto
    ): Promise<CheckStockFacadeOutputDto>
}
