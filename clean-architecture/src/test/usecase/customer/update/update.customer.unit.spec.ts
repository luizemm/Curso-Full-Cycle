import CustomerImpl from "../../../../domain/customer/entity/customer"
import Customer from "../../../../domain/customer/entity/customer-interface"
import CustomerFactory from "../../../../domain/customer/factory/customer.factory"
import CustomerRepository from "../../../../domain/customer/repository/customer-interface.repository"
import AddressImpl from "../../../../domain/customer/value-object/address"
import { ERROR_MESSAGES } from "../../../../error/error.messages"
import NotFoundError from "../../../../error/not-found.error"
import ValidationError from "../../../../error/validation.error"
import {
    InputUpdateCustomerDto,
    OutputUpdateCustomerDto,
} from "../../../../usecase/customer/update/update.customer.dto"
import UpdateCustomerUseCase from "../../../../usecase/customer/update/update.customer.usecase"

const customer: Customer = CustomerFactory.createWithAddress(
    "John",
    new AddressImpl("Street", 123, "Zip", "City")
)
let input: InputUpdateCustomerDto

const mockRepository: jest.Mocked<CustomerRepository> = {
    create: jest.fn(),
    find: jest.fn().mockResolvedValue(customer),
    findAll: jest.fn(),
    update: jest.fn(),
}

describe("Unit test update customer use case", () => {
    beforeEach(() => {
        input = {
            id: customer.id,
            name: "John updated",
            address: {
                street: "Street updated",
                number: 1234,
                zip: "Zip updated",
                city: "City updated",
            },
        }
    })

    it("should update a customer", async () => {
        const useCase = new UpdateCustomerUseCase(mockRepository)

        const output = await useCase.execute(input)

        expect(mockRepository.update).toHaveBeenCalled()
        expect(output).toStrictEqual({
            id: input.id,
            name: input.name,
            address: input.address,
        } as OutputUpdateCustomerDto)
    })

    it("should throw error when it does not find a customer with given id", async () => {
        await expect(async () => {
            mockRepository.find.mockResolvedValueOnce(null)

            const useCase = new UpdateCustomerUseCase(mockRepository)

            await useCase.execute(input)
        }).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.CUSTOMER_NOT_FOUND))
    })

    it("should throw error when name is missing", async () => {
        await expect(async () => {
            const useCase = new UpdateCustomerUseCase(mockRepository)

            input.name = ""

            await useCase.execute(input)
        }).rejects.toThrow(
            expect.objectContaining({
                message: `${CustomerImpl.ERROR_CONTEXT}: ${ERROR_MESSAGES.REQUIRED_FIELD.NAME}`,
            })
        )
    })

    it("should throw error when street is missing", async () => {
        await expect(async () => {
            const usecase = new UpdateCustomerUseCase(mockRepository)

            input.address!.street = ""

            await usecase.execute(input)
        }).rejects.toThrow(
            new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.STREET)
        )
    })
})
