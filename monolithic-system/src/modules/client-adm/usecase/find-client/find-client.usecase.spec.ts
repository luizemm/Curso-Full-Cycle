import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/entity/client.entity"
import Address from "../../domain/value-object/address.value-object"
import ClientGateway from "../../gateway/client.gateway.interface"
import FindClientUseCaseImpl from "./find-client.usecase"
import {
    FindClientInputDto,
    FindClientOutputDto,
} from "./find-client.usecase.dto"

const createdDate = new Date()

const address = new Address({
    street: "Street 1",
    number: "100",
    complement: "Apt 101",
    city: "City 1",
    state: "State 1",
    zipCode: "12345-678",
})

const client = new Client({
    id: new Id("1"),
    name: "Client 1",
    email: "client1@email.com",
    document: "Document",
    address,
    createdAt: createdDate,
    updatedAt: createdDate,
})

const createMockClientRepository = (): jest.Mocked<ClientGateway> => ({
    add: jest.fn(),
    find: jest.fn().mockResolvedValue(client),
})

describe("Find client use case unit test", () => {
    it("should find a client", async () => {
        const clientRepository = createMockClientRepository()
        const useCase = new FindClientUseCaseImpl(clientRepository)

        const input: FindClientInputDto = {
            id: "1",
        }

        const result = await useCase.execute(input)

        expect(result).toStrictEqual({
            id: input.id,
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
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        } as FindClientOutputDto)
    })
})
