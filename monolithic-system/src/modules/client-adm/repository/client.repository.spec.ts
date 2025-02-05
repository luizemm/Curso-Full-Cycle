import { Sequelize } from "sequelize-typescript"
import Client from "../domain/client.entity"
import ClientModel from "./client.model"
import ClientRepository from "./client.repository"

describe("Client repository integration test", () => {
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
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a client", async () => {
        const client = new Client({
            name: "Client 1",
            email: "client1@email.com",
            address: "Address 1",
        })

        const clientRepository = new ClientRepository()

        await clientRepository.add(client)

        const clientDb = await ClientModel.findOne({
            where: { id: client.id!.id },
        })

        expect({
            id: clientDb!.id,
            name: clientDb!.name,
            email: clientDb!.email,
            address: clientDb!.address,
            createdAt: clientDb!.createdAt,
            updatedAt: clientDb!.updatedAt,
        }).toStrictEqual({
            id: client.id!.id,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        })
    })

    it("should find a client", async () => {
        const dateNow = new Date()

        const client = {
            id: "1",
            name: "Client 1",
            email: "client1@email.com",
            address: "Address 1",
            createdAt: dateNow,
            updatedAt: dateNow,
        }

        await ClientModel.create(client)

        const clientRepository = new ClientRepository()

        const clientDb = await clientRepository.find(client.id)

        expect({
            id: clientDb.id!.id,
            name: clientDb.name,
            email: clientDb.email,
            address: clientDb.address,
            createdAt: clientDb.createdAt,
            updatedAt: clientDb.updatedAt,
        }).toStrictEqual(client)
    })
})
