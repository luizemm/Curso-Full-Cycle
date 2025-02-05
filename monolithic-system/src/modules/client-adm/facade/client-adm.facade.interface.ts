import {
    AddClientFacadeInputDto,
    FindClientFacadeInputDto,
    FindClientFacadeOutputDto,
} from "./client-adm.facade.dto"

export default interface ClientAdmFacade {
    add(input: AddClientFacadeInputDto): Promise<void>
    find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto>
}
