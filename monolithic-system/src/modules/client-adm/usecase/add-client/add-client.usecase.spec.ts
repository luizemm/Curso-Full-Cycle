import Client from "../../domain/client.entity"
import ClientGateway from "../../gateway/client.gateway.interface"
import AddClientUseCaseImpl from "./add-client.usecase"
import { AddClientInputDto, AddClientOutputDto } from "./add-client.usecase.dto"

const createMockClientRepository = (): jest.Mocked<ClientGateway> => ({
    add: jest.fn().mockImplementation((client: Client) => {
        const dateNow = new Date()

        client.createdAt = dateNow
        client.updatedAt = dateNow
    }),
    find: jest.fn(),
})

describe("Add client use case unit test", () => {
    it("should add a client", async () => {
        const clientRepository = createMockClientRepository()
        const usecase = new AddClientUseCaseImpl(clientRepository)

        const input: AddClientInputDto = {
            name: "Client 1",
            email: "client@email.com",
            address: "Address 1",
        }

        jest.useFakeTimers()

        const result = await usecase.execute(input)

        const dateNow = new Date()

        expect(result).toStrictEqual({
            id: expect.any(String),
            name: input.name,
            email: input.email,
            address: input.address,
            createdAt: dateNow,
            updatedAt: dateNow,
        } as AddClientOutputDto)

        jest.useRealTimers()
    })
})
