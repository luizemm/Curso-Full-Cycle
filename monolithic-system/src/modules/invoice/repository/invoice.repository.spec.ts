import { Sequelize } from "sequelize-typescript"
import InvoiceItem from "../domain/entity/invoice-item.entity"
import Invoice from "../domain/entity/invoice.entity"
import Address from "../domain/value-object/address.value-object"
import InvoiceGateway from "../gateway/invoice.gateway"
import InvoiceItemModel from "./invoice-item.model"
import InvoiceModel from "./invoice.model"
import InvoiceRepository from "./invoice.repository"
import { ERROR_MESSAGES } from "../util/message/error.messages"

const createInvoice = () =>
    new Invoice({
        name: "John Doe",
        address: new Address({
            street: "Street 1",
            number: "100",
            complement: "Apt 101",
            city: "City 1",
            state: "State 1",
            zipCode: "12345678",
        }),
        document: "12345678900",
        items: [
            new InvoiceItem({
                name: "Product 1",
                price: 10,
            }),
        ],
    })

describe("Invoice repository test", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([InvoiceModel, InvoiceItemModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create an invoice", async () => {
        const repository: InvoiceGateway = new InvoiceRepository()

        const invoice = createInvoice()

        await repository.add(invoice)

        const result = await InvoiceModel.findOne({
            where: { id: invoice.id!.id },
            include: InvoiceItemModel,
        })

        expect({
            id: result!.id,
            name: result!.name,
            document: result!.document,
            address: {
                street: result!.street,
                city: result!.city,
                complement: result!.complement,
                number: result!.number,
                state: result!.state,
                zipCode: result!.zipCode,
            },
            items: result!.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })),
            createdAt: result!.createdAt,
            updatedAt: result!.updatedAt,
        }).toStrictEqual({
            id: invoice.id!.id,
            name: invoice.name,
            document: invoice.document,
            address: {
                street: invoice.address.street,
                city: invoice.address.city,
                complement: invoice.address.complement,
                number: invoice.address.number,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
            },
            items: invoice.items.map(item => ({
                id: item.id!.id,
                name: item.name,
                price: item.price,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        })
    })

    it("should find an invoice by id", async () => {
        const repository: InvoiceGateway = new InvoiceRepository()

        const dateNow = new Date()
        const invoice = createInvoice()

        invoice.createdAt = dateNow
        invoice.updatedAt = dateNow

        invoice.items.forEach(item => {
            item.createdAt = dateNow
            item.updatedAt = dateNow
        })

        await InvoiceModel.create(
            {
                id: invoice.id!.id,
                name: invoice.name,
                document: invoice.document,
                street: invoice.address.street,
                city: invoice.address.city,
                complement: invoice.address.complement,
                number: invoice.address.number,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
                items: invoice.items.map(item => ({
                    id: item.id!.id,
                    name: item.name,
                    price: item.price,
                    invoice_id: invoice.id!.id,
                    createdAt: dateNow,
                    updatedAt: dateNow,
                })),
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt,
            },
            {
                include: InvoiceItemModel,
            }
        )

        const result = await repository.find(invoice.id!.id)

        expect({
            id: result.id!.id,
            name: result.name,
            document: result.document,
            address: {
                street: result.address.street,
                city: result.address.city,
                complement: result.address.complement,
                number: result.address.number,
                state: result.address.state,
                zipCode: result.address.zipCode,
            },
            items: result.items.map(item => ({
                id: item.id!.id,
                name: item.name,
                price: item.price,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })),
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        }).toStrictEqual({
            id: invoice.id!.id,
            name: invoice.name,
            document: invoice.document,
            address: {
                street: invoice.address.street,
                city: invoice.address.city,
                complement: invoice.address.complement,
                number: invoice.address.number,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
            },
            items: invoice.items.map(item => ({
                id: item.id!.id,
                name: item.name,
                price: item.price,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        })
    })

    it("should throw an error when does not found an invoice with the given id", async () => {
        await expect(async () => {
            const repository: InvoiceGateway = new InvoiceRepository()
            await repository.find("1")
        }).rejects.toThrow(ERROR_MESSAGES.INVOICE_NOT_FOUND)
    })
})
