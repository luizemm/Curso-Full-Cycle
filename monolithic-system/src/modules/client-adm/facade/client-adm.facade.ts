import { AddClientUseCase } from "../usecase/add-client/add-client.usecase.interface"
import FindClientUseCase from "../usecase/find-client/find-client.usecase.interface"
import {
    AddClientFacadeInputDto,
    FindClientFacadeInputDto,
    FindClientFacadeOutputDto,
} from "./client-adm.facade.dto"
import ClientAdmFacade from "./client-adm.facade.interface"

export interface ClientAdmFacadeProps {
    addUsecase: AddClientUseCase
    findUsecase: FindClientUseCase
}

export default class ClientAdmFacadeImpl implements ClientAdmFacade {
    private readonly _addUsecase: AddClientUseCase
    private readonly _findUsecase: FindClientUseCase

    constructor(props: ClientAdmFacadeProps) {
        this._addUsecase = props.addUsecase
        this._findUsecase = props.findUsecase
    }

    async add(input: AddClientFacadeInputDto): Promise<void> {
        await this._addUsecase.execute(input)
    }
    async find(
        input: FindClientFacadeInputDto
    ): Promise<FindClientFacadeOutputDto> {
        const client = await this._findUsecase.execute(input)

        return {
            id: client.id,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        }
    }
}
