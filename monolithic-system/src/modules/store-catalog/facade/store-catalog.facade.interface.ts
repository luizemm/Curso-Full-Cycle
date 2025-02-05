import {
    FindAllStoreCatalogFacadeOutputDto,
    FindStoreCatalogFacadeInputDto,
    FindStoreCatalogFacadeOutputDto,
} from "./store-catalog.facade.dto"

export default interface StoreCatalogFacade {
    find(
        id: FindStoreCatalogFacadeInputDto
    ): Promise<FindStoreCatalogFacadeOutputDto>
    findAll(): Promise<FindAllStoreCatalogFacadeOutputDto>
}
