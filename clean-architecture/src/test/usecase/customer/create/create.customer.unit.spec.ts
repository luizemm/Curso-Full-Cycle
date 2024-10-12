import CustomerRepository from "../../../../domain/customer/repository/customer-interface.repository"
import { ERROR_MESSAGES } from "../../../../error/error.messages"
import ValidationError from "../../../../error/validation.error"
import {
    InputCreateCustomerDto,
    OutputCreateCustomerDto,
} from "../../../../usecase/customer/create/create.customer.dto"
import CreateCustomerUseCase from "../../../../usecase/customer/create/create.customer.usecase"

let input: InputCreateCustomerDto

const mockRepository: jest.Mocked<CustomerRepository> = {
    create: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
}

describe("Unit test create customer use case", () => {
    beforeEach(() => {
        input = {
            name: "John",
            address: {
                street: "Street",
                number: 123,
                zip: "Zip",
                city: "City",
            },
        }
    })

    it("should create a customer", async () => {
        const useCase = new CreateCustomerUseCase(mockRepository)

        const output = await useCase.execute(input)

        expect(output).toStrictEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address!.street,
                number: input.address!.number,
                zip: input.address!.zip,
                city: input.address!.city,
            },
        } as OutputCreateCustomerDto)
    })

    it("should throw error when name is missing", async () => {
        await expect(async () => {
            const useCase = new CreateCustomerUseCase(mockRepository)

            input.name = ""

            await useCase.execute(input)
        }).rejects.toThrow(
            new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.NAME)
        )
    })

    it("should throw error when street is missing", async () => {
        await expect(async () => {
            const useCase = new CreateCustomerUseCase(mockRepository)

            input.address!.street = ""

            await useCase.execute(input)
        }).rejects.toThrow(
            new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.STREET)
        )
    })
})
