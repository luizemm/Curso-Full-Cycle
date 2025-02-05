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
            address: "Address 1",
        }

        await facade.add(input)

        const clientDb = await ClientModel.findOne({
            where: { id: input.id },
        })

        expect({
            id: clientDb!.id,
            name: clientDb!.name,
            email: clientDb!.email,
            address: clientDb!.address,
        } as AddClientFacadeInputDto).toStrictEqual(input)
    })

    it("should find a client", async () => {
        const facade = ClientAdmFacadeFactory.create()

        const createdDate = new Date()

        const client = {
            id: "1",
            name: "Client 1",
            email: "client1@email.com",
            address: "Address 1",
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
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        } as FindClientFacadeOutputDto)
    })
})
