import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client.entity"
import ClientGateway from "../../gateway/client.gateway.interface"
import { AddClientInputDto, AddClientOutputDto } from "./add-client.usecase.dto"
import { AddClientUseCase } from "./add-client.usecase.interface"

export default class AddClientUseCaseImpl implements AddClientUseCase {
    private readonly _clientRepository: ClientGateway

    constructor(clientRepository: ClientGateway) {
        this._clientRepository = clientRepository
    }

    async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
        const client = new Client({
            id: new Id(input.id),
            name: input.name,
            email: input.email,
            address: input.address,
        })

        await this._clientRepository.add(client)

        return {
            id: client.id!.id,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt!,
            updatedAt: client.updatedAt!,
        }
    }
}
