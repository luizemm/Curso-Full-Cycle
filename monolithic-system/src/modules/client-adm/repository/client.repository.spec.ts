import { Sequelize } from "sequelize-typescript"
import Client from "../domain/entity/client.entity"
import ClientModel from "./client.model"
import ClientRepository from "./client.repository"
import Address from "../domain/value-object/address.value-object"

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
        const address = new Address({
            street: "Street 1",
            number: "100",
            complement: "Apt 101",
            city: "City 1",
            state: "State 1",
            zipCode: "12345678",
        })

        const client = new Client({
            name: "Client 1",
            email: "client1@email.com",
            document: "Document",
            address,
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
            document: clientDb!.document,
            street: clientDb!.street,
            number: clientDb!.number,
            complement: clientDb!.complement,
            city: clientDb!.city,
            state: clientDb!.state,
            zipCode: clientDb!.zipCode,
            createdAt: clientDb!.createdAt,
            updatedAt: clientDb!.updatedAt,
        }).toStrictEqual({
            id: client.id!.id,
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
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
            document: "document",
            street: "Street 1",
            number: "100",
            complement: "Apt 101",
            city: "City 1",
            state: "State 1",
            zipCode: "12345-678",
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
            document: clientDb.document,
            street: clientDb.address.street,
            number: clientDb.address.number,
            complement: clientDb.address.complement,
            city: clientDb.address.city,
            state: clientDb.address.state,
            zipCode: clientDb.address.zipCode,
            createdAt: clientDb.createdAt,
            updatedAt: clientDb.updatedAt,
        }).toStrictEqual(client)
    })
})
