import { Sequelize } from "sequelize-typescript"
import request from "supertest"
import { dbModels } from "../../../modules/@shared/infraestructure/database/sequelize"
import ClientModel from "../../../modules/client-adm/repository/client.model"
import { createApp } from "../../__test__/server"

describe("POST /clients", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
        })
        sequelize.addModels(dbModels)
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a client", async () => {
        const client = {
            name: "Client 1",
            email: "client@example.com",
            document: "document 1",
            address: {
                street: "street 1",
                number: "123",
                complement: "complement",
                city: "City 1",
                state: "State 1",
                zipCode: "12345-678",
            },
        }

        await request(createApp()).post("/clients").send(client).expect(204)

        const clientDb = await ClientModel.findOne({
            where: { name: client.name },
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
        }).toStrictEqual({
            id: expect.any(String),
            ...client,
        })
    })
})
