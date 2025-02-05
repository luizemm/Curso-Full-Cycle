import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client.entity"
import ClientGateway from "../../gateway/client.gateway.interface"
import FindClientUseCaseImpl from "./find-client.usecase"
import {
    FindClientInputDto,
    FindClientOutputDto,
} from "./find-client.usecase.dto"

const createdDate = new Date()

const client = new Client({
    id: new Id("1"),
    name: "Client 1",
    email: "client1@email.com",
    address: "Address 1",
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
        const usecase = new FindClientUseCaseImpl(clientRepository)

        const input: FindClientInputDto = {
            id: "1",
        }

        const result = await usecase.execute(input)

        expect(result).toStrictEqual({
            id: input.id,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        } as FindClientOutputDto)
    })
})
