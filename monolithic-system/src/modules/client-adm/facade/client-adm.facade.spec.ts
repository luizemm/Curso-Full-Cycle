import { Sequelize } from "sequelize-typescript"
import ClientModel from "../repository/client.model"
import {
    AddClientFacadeInputDto,
    FindClientFacadeInputDto,
    FindClientFacadeOutputDto,
} from "./client-adm.facade.dto"
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory"

describe("ClientAdmFacade", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([ClientModel])
        await sequelize.sync()

        jest.useFakeTimers()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a client", async () => {
        const facade = ClientAdmFacadeFactory.create()

        const input: AddClientFacadeInputDto = {
            id: "1",
            name: "Client 1",
            email: "client1@email.com",
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

        await facade.add(input)

        const clientDb = await ClientModel.findOne({
            where: { id: input.id },
        })

        expect({
            id: clientDb!.id,
            name: clientDb!.name,
            email: clientDb!.email,
            document: clientDb!.document,
            address: {
                street: clientDb!.street,
                number: clientDb!.number,
                complement: clientDb!.complement,
                city: clientDb!.city,
                state: clientDb!.state,
                zipCode: clientDb!.zipCode,
            },
        } as AddClientFacadeInputDto).toStrictEqual(input)
    })

    it("should find a client", async () => {
        const facade = ClientAdmFacadeFactory.create()

        const createdDate = new Date()

        const client = {
            id: "1",
            name: "Client 1",
            email: "client1@email.com",
            document: "Document",
            street: "Street 1",
            number: "1",
            complement: "",
            city: "City 1",
            state: "State 1",
            zipCode: "12345-678",
            createdAt: createdDate,
            updatedAt: createdDate,
        }

        await ClientModel.create(client)

        const input: FindClientFacadeInputDto = {
            id: client.id,
        }

        const result = await facade.find(input)

        expect(result).toStrictEqual({
            id: client.id,
            name: client.name,
            email: client.email,
            document: client.document,
            address: {
                street: client.street,
                number: client.number,
                complement: client.complement,
                city: client.city,
                state: client.state,
                zipCode: client.zipCode,
            },
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        } as FindClientFacadeOutputDto)
    })
})
