import CustomerFactory from "../../../../domain/customer/factory/customer.factory"
import CustomerRepository from "../../../../domain/customer/repository/customer-interface.repository"
import AddressImpl from "../../../../domain/customer/value-object/address"
import Address from "../../../../domain/customer/value-object/address-interface"
import {
    CustomerDto,
    InputListCustomerDto,
    OutputListCustomerDto,
} from "../../../../usecase/customer/list/list.customer.dto"
import ListCustomerUseCase from "../../../../usecase/customer/list/list.customer.usecase"

const customers = [
    CustomerFactory.createWithAddress(
        "John Doe",
        new AddressImpl("Street", 123, "zip", "city")
    ),
    CustomerFactory.create("Jane Doe"),
]

const mockRepository: jest.Mocked<CustomerRepository> = {
    create: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn().mockResolvedValue(customers),
    update: jest.fn(),
}

const input: InputListCustomerDto = {}

const toAddressDtoOrUndefined = (
    address: Address | undefined
): CustomerDto["address"] | undefined => {
    if (!address) return undefined

    return {
        street: address.street,
        number: address.number,
        zip: address.zip,
        city: address.city,
    }
}

describe("Unit test list customer use case", () => {
    it("should list the customers", async () => {
        const useCase = new ListCustomerUseCase(mockRepository)

        const output = await useCase.execute(input)

        expect(output.customers.length).toBe(customers.length)
        expect(output).toStrictEqual({
            customers: customers.map(
                customer =>
                    ({
                        id: customer.id,
                        name: customer.name,
                        address: toAddressDtoOrUndefined(customer.address),
                    }) as CustomerDto
            ),
        } as OutputListCustomerDto)
    })
})
