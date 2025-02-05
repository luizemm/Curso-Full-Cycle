import Invoice from "../../domain/entity/invoice.entity"
import InvoiceGateway from "../../gateway/invoice.gateway"
import GenerateInvoiceUseCaseImpl from "./generate-invoice.usecase"
import {
    GenerateInvoiceUseCaseInputDto,
    GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.usecase.dto"

const createMockRepository = (): jest.Mocked<InvoiceGateway> => ({
    add: jest.fn().mockImplementation((invoice: Invoice) => {
        const createdDate = new Date()

        invoice.items.forEach(item => {
            item.createdAt = createdDate
            item.updatedAt = createdDate
        })

        invoice.createdAt = createdDate
        invoice.updatedAt = createdDate
    }),
    find: jest.fn(),
})

describe("Generate invoice use case unit tests", () => {
    it("should generate an invoice", async () => {
        const invoiceRepository = createMockRepository()
        const useCase = new GenerateInvoiceUseCaseImpl(invoiceRepository)

        const input: GenerateInvoiceUseCaseInputDto = {
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
            ],
        }

        const result = await useCase.execute(input)

        expect(invoiceRepository.add).toHaveBeenCalled()
        expect(result).toStrictEqual({
            id: expect.any(String),
            name: input.name,
            document: input.document,
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
            items: input.items.map(item => ({
                id: expect.any(String),
                name: item.name,
                price: item.price,
            })),
            total: input.items.reduce((total, item) => total + item.price, 0),
        } as GenerateInvoiceUseCaseOutputDto)
    })
})
