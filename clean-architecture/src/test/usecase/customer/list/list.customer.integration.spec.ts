import Customer from "../../../../domain/customer/entity/customer-interface"
import CustomerFactory from "../../../../domain/customer/factory/customer.factory"
import CustomerRepository from "../../../../domain/customer/repository/customer-interface.repository"
import AddressImpl from "../../../../domain/customer/value-object/address"
import Address from "../../../../domain/customer/value-object/address-interface"
import DatabaseTable from "../../../../infrastructure/@shared/repository/tables.enum"
import CustomerRepositoryImpl from "../../../../infrastructure/customer/repository/sequelize/customer.repository"
import {
    CustomerDto,
    InputListCustomerDto,
    OutputListCustomerDto,
} from "../../../../usecase/customer/list/list.customer.dto"
import ListCustomerUseCase from "../../../../usecase/customer/list/list.customer.usecase"
import { createDbInstance } from "../../../@config/database/database.test.config"
import Database from "../../../../infrastructure/database/database-interface"

const customers = [
    CustomerFactory.createWithAddress(
        "John Doe",
        new AddressImpl("Street", 123, "zip", "city")
    ),
    CustomerFactory.create("Jane Doe"),
]

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

const createCustomer = async (
    customer: Customer,
    repository: CustomerRepository
) => await repository.create(customer)

describe("Integration test list customer use case", () => {
    let db: Database

    beforeEach(async () => {
        db = createDbInstance([DatabaseTable.CUSTOMER])

        await db.init()
    })

    afterEach(async () => {
        await db.close()
    })

    it("should list the customers", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const useCase = new ListCustomerUseCase(customerRepository)

        await Promise.all(
            customers.map(customer =>
                createCustomer(customer, customerRepository)
            )
        )

        const output = await useCase.execute(input)
        const customersDb = await customerRepository.findAll()

        expect(output.customers.length).toBe(customersDb.length)
        expect(output).toStrictEqual({
            customers: customersDb.map(
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
