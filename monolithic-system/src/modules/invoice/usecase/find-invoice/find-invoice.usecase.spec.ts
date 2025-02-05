import InvoiceItem from "../../domain/entity/invoice-item.entity"
import Invoice from "../../domain/entity/invoice.entity"
import Address from "../../domain/value-object/address.value-object"
import InvoiceGateway from "../../gateway/invoice.gateway"
import { ERROR_MESSAGES } from "../../util/message/error.messages"
import FindInvoiceUseCaseImpl from "./find-invoice.usecase"
import {
    FindInvoiceUseCaseInputDTO,
    FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.usecase.dto"

const invoice = new Invoice({
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

const createMockRepository = (): jest.Mocked<InvoiceGateway> => ({
    add: jest.fn(),
    find: jest.fn().mockResolvedValue(invoice),
})

describe("Find invoice unit tests", () => {
    it("should find an invoice by id", async () => {
        const invoiceRepository = createMockRepository()
        const useCase = new FindInvoiceUseCaseImpl(invoiceRepository)

        const input: FindInvoiceUseCaseInputDTO = {
            id: invoice.id!.id,
        }

        const result = await useCase.execute(input)

        expect(result).toStrictEqual({
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
            })),
            total: invoice.items.reduce((total, item) => total + item.price, 0),
            createdAt: invoice.createdAt,
        } as FindInvoiceUseCaseOutputDTO)
    })

    it("should throw an error when does not found an invoice with the given id", async () => {
        await expect(async () => {
            const invoiceRepository = createMockRepository()
            const useCase = new FindInvoiceUseCaseImpl(invoiceRepository)

            const input: FindInvoiceUseCaseInputDTO = {
                id: "1",
            }

            invoiceRepository.find.mockRejectedValueOnce(
                new Error(ERROR_MESSAGES.INVOICE_NOT_FOUND)
            )

            await useCase.execute(input)
        }).rejects.toThrow(ERROR_MESSAGES.INVOICE_NOT_FOUND)
    })
})
