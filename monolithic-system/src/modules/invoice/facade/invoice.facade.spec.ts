import { Sequelize } from "sequelize-typescript"
import InvoiceModel from "../repository/invoice.model"
import InvoiceItemModel from "../repository/invoice-item.model"
import InvoiceFacade from "./invoice.facade.interface"
import {
    FindInvoiceFacadeInputDTO,
    FindInvoiceFacadeOutputDTO,
    GenerateInvoiceFacadeInputDto,
    GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.dto"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"
import { ERROR_MESSAGES } from "../util/message/error.messages"

describe("Invoice Facade Integration Test", () => {
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

    it("should generate an invoice", async () => {
        const facade: InvoiceFacade = InvoiceFacadeFactory.create()

        const input: GenerateInvoiceFacadeInputDto = {
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
                },
                {
                    id: "2",
                    name: "Product 2",
                    price: 20,
                },
            ],
        }

        const result = await facade.generateInvoice(input)

        const invoiceDb = await InvoiceModel.findOne({
            where: { id: result.id },
            include: InvoiceItemModel,
        })

        expect(result).toStrictEqual({
            id: invoiceDb!.id,
            name: invoiceDb!.name,
            document: invoiceDb!.document,
            street: invoiceDb!.street,
            number: invoiceDb!.number,
            complement: invoiceDb!.complement,
            city: invoiceDb!.city,
            state: invoiceDb!.state,
            zipCode: invoiceDb!.zipCode,
            items: invoiceDb!.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
            })),
            total: invoiceDb!.items.reduce(
                (total, item) => total + item.price,
                0
            ),
        } as GenerateInvoiceFacadeOutputDto)
    })

    it("should find an invoice by id", async () => {
        const facade: InvoiceFacade = InvoiceFacadeFactory.create()

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

        const input: FindInvoiceFacadeInputDTO = {
            id: invoice.id,
        }

        const result = await facade.findInvoice(input)

        expect(result).toStrictEqual({
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
            total: invoice.items.reduce((total, item) => total + item.price, 0),
            createdAt: invoice.createdAt,
        } as FindInvoiceFacadeOutputDTO)
    })

    it("should throw an error when does not find an invoice with the given id", async () => {
        await expect(async () => {
            const facade: InvoiceFacade = InvoiceFacadeFactory.create()

            const input: FindInvoiceFacadeInputDTO = {
                id: "1",
            }

            await facade.findInvoice(input)
        }).rejects.toThrow(ERROR_MESSAGES.INVOICE_NOT_FOUND)
    })
})
