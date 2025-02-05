import ClientGateway from "../../gateway/client.gateway.interface"
import {
    FindClientInputDto,
    FindClientOutputDto,
} from "./find-client.usecase.dto"
import FindClientUseCase from "./find-client.usecase.interface"

export default class FindClientUseCaseImpl implements FindClientUseCase {
    private readonly _clientRepository: ClientGateway

    constructor(clientRepository: ClientGateway) {
        this._clientRepository = clientRepository
    }

    async execute(input: FindClientInputDto): Promise<FindClientOutputDto> {
        const client = await this._clientRepository.find(input.id)

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
