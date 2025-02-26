import Client from "../../domain/entity/client.entity"
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
        const useCase = new AddClientUseCaseImpl(clientRepository)

        const input: AddClientInputDto = {
            name: "Client 1",
            email: "client@email.com",
            document: "Document",
            address: {
                street: "Street 1",
                number: "1",
                complement: "",
                city: "City 1",
                state: "State 1",
                zipCode: "12345-678",
            },
        }

        jest.useFakeTimers()

        const result = await useCase.execute(input)

        const dateNow = new Date()

        expect(result).toStrictEqual({
            id: expect.any(String),
            name: input.name,
            email: input.email,
            document: input.document,
            address: {
                street: input.address.street,
                number: input.address.number,
                complement: input.address.complement,
                city: input.address.city,
                state: input.address.state,
                zipCode: input.address.zipCode,
            },
            createdAt: dateNow,
            updatedAt: dateNow,
        } as AddClientOutputDto)

        jest.useRealTimers()
    })
})
