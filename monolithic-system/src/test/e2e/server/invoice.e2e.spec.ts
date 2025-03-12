import { Sequelize } from "sequelize-typescript"
import { Umzug } from "umzug"
import { migrator } from "../../../modules/@shared/infraestructure/migration-tool/migrator"
import { dbModels } from "../../../modules/@shared/infraestructure/database/sequelize"
import InvoiceModel from "../../../modules/invoice/repository/invoice.model"
import InvoiceItemModel from "../../../modules/invoice/repository/invoice-item.model"
import request from "supertest"
import { createApp } from "../../__test__/server"
import { ERROR_MESSAGES } from "../../../modules/invoice/util/message/error.messages"

describe("GET /invoice/{id}", () => {
    let sequelize: Sequelize
    let migration: Umzug<Sequelize>

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
        })
        migration = migrator(sequelize)
        sequelize.addModels(dbModels)
        await migration.up()
        await sequelize.sync()
    })

    afterEach(async () => {
        await migration.down()
        await sequelize.close()
    })

    it("should return an invoice by id", async () => {
        const dateNow = new Date()

        const invoice = {
            id: "1",
            name: "John Doe",
            document: "12345678900",
            street: "Street 1",
            number: "100",
            complement: "Apt 101",
            city: "City 1",
            state: "State 1",
            zipCode: "12345678",
            items: [
                {
                    id: "1",
                    name: "Product 1",
                    price: 10,
                    createdAt: dateNow,
                    updatedAt: dateNow,
                },
                {
                    id: "2",
                    name: "Product 2",
                    price: 20,
                    createdAt: dateNow,
                    updatedAt: dateNow,
                },
            ],
            createdAt: dateNow,
            updatedAt: dateNow,
        }

        await InvoiceModel.create(invoice, {
            include: InvoiceItemModel,
        })

        await request(createApp())
            .get(`/invoice/${invoice.id}`)
            .expect(200, {
                id: invoice.id,
                name: invoice.name,
                document: invoice.document,
                address: {
                    street: invoice.street,
                    city: invoice.city,
                    complement: invoice.complement,
                    number: invoice.number,
                    state: invoice.state,
                    zipCode: invoice.zipCode,
                },
                items: invoice.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                })),
                total: invoice.items.reduce(
                    (total, item) => total + item.price,
                    0
                ),
                createdAt: invoice.createdAt.toISOString(),
            })
    })

    it("should return 404 if invoice not found", async () => {
        await request(createApp()).get("/invoice/1").expect(404, {
            error: ERROR_MESSAGES.INVOICE_NOT_FOUND,
        })
    })
})
