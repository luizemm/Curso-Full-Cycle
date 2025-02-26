import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/entity/client.entity"
import Address from "../../domain/value-object/address.value-object"
import ClientGateway from "../../gateway/client.gateway.interface"
import { AddClientInputDto, AddClientOutputDto } from "./add-client.usecase.dto"
import { AddClientUseCase } from "./add-client.usecase.interface"

export default class AddClientUseCaseImpl implements AddClientUseCase {
    private readonly _clientRepository: ClientGateway

    constructor(clientRepository: ClientGateway) {
        this._clientRepository = clientRepository
    }

    async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
        const address = new Address({
            street: input.address.street,
            number: input.address.number,
            complement: input.address.complement,
            city: input.address.city,
            state: input.address.state,
            zipCode: input.address.zipCode,
        })

        const client = new Client({
            id: new Id(input.id),
            name: input.name,
            email: input.email,
            document: input.document,
            address,
        })

        await this._clientRepository.add(client)

        return {
            id: client.id!.id,
            name: client.name,
            email: client.email,
            document: client.document,
            address: {
                street: client.address.street,
                number: client.address.number,
                complement: client.address.complement,
                city: client.address.city,
                state: client.address.state,
                zipCode: client.address.zipCode,
            },
            createdAt: client.createdAt!,
            updatedAt: client.updatedAt!,
        }
    }
}
