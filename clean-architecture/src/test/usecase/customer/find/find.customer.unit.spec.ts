import CustomerImpl from "../../../../domain/customer/entity/customer"
import CustomerRepository from "../../../../domain/customer/repository/customer-interface.repository"
import AddressImpl from "../../../../domain/customer/value-object/address"
import { ERROR_MESSAGES } from "../../../../error/error.messages"
import NotFoundError from "../../../../error/not-found.error"
import {
    InputFindCustomerDto,
    OutputFindCustomerDto,
} from "../../../../usecase/customer/find/find.customer.dto"
import FindCustomerUseCase from "../../../../usecase/customer/find/find.customer.usecase"

const customer = new CustomerImpl("123", "John")
const address = new AddressImpl("Street", 123, "city", "Zip")
customer.changeAddress(address)

const mockRepository: jest.Mocked<CustomerRepository> = {
    create: jest.fn(),
    find: jest.fn().mockResolvedValue(customer),
    findAll: jest.fn(),
    update: jest.fn(),
}

describe("Unit test find customer use case", () => {
    it("should find a customer", async () => {
        const useCase = new FindCustomerUseCase(mockRepository)

        const input: InputFindCustomerDto = {
            id: customer.id,
        }

        const expectedOutput: OutputFindCustomerDto = {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.address!.street,
                city: customer.address!.city,
                number: customer.address!.number,
                zip: customer.address!.zip,
            },
        }

        const output = await useCase.execute(input)

        expect(output).toStrictEqual(expectedOutput)
    })

    it("should throw error if not find a customer", () => {
        expect(async () => {
            const useCase = new FindCustomerUseCase(mockRepository)

            mockRepository.find.mockResolvedValueOnce(null)

            await useCase.execute({ id: "123" } as InputFindCustomerDto)
        }).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.CUSTOMER_NOT_FOUND))
    })
})
