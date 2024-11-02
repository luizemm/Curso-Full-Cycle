import Customer from "../../../../domain/customer/entity/customer-interface"
import CustomerFactory from "../../../../domain/customer/factory/customer.factory"
import AddressImpl from "../../../../domain/customer/value-object/address"
import { ERROR_MESSAGES } from "../../../../error/error.messages"
import NotFoundError from "../../../../error/not-found.error"
import ValidationError from "../../../../error/validation.error"
import DatabaseTable from "../../../../infrastructure/@shared/repository/tables.enum"
import CustomerRepositoryImpl from "../../../../infrastructure/customer/repository/sequelize/customer.repository"
import {
    InputUpdateCustomerDto,
    OutputUpdateCustomerDto,
} from "../../../../usecase/customer/update/update.customer.dto"
import UpdateCustomerUseCase from "../../../../usecase/customer/update/update.customer.usecase"
import { createDbInstance } from "../../../@config/database/database.test.config"
import Database from "../../../../infrastructure/database/database-interface"

const customer: Customer = CustomerFactory.createWithAddress(
    "John",
    new AddressImpl("Street", 123, "Zip", "City")
)
let input: InputUpdateCustomerDto

describe("Unit test update customer use case", () => {
    let db: Database

    beforeEach(async () => {
        db = createDbInstance([DatabaseTable.CUSTOMER])

        await db.init()

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

    afterEach(async () => {
        await db.close()
    })

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const useCase = new UpdateCustomerUseCase(customerRepository)

        await customerRepository.create(customer)

        const output = await useCase.execute(input)

        const customerDb = await customerRepository.find(input.id)

        expect(output).toStrictEqual({
            id: input.id,
            name: input.name,
            address: input.address,
        } as OutputUpdateCustomerDto)

        expect(customerDb).not.toBeNull()
        expect({
            id: customerDb!.id,
            name: customerDb!.name,
            address: {
                street: customerDb!.address!.street,
                number: customerDb!.address!.number,
                zip: customerDb!.address!.zip,
                city: customerDb!.address!.city,
            },
        } as InputUpdateCustomerDto).toStrictEqual(input)
    })

    it("should throw error when not find a customer with given id", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        await expect(async () => {
            const useCase = new UpdateCustomerUseCase(customerRepository)

            await useCase.execute(input)
        }).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.CUSTOMER_NOT_FOUND))

        const customerDb = await customerRepository.find(customer.id)

        expect(customerDb).toBeNull()
    })

    it("should throw error when name is missing", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        await expect(async () => {
            const useCase = new UpdateCustomerUseCase(customerRepository)

            await customerRepository.create(customer)

            input.name = ""

            await useCase.execute(input)
        }).rejects.toThrow(
            new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.NAME)
        )

        const customerDb = await customerRepository.find(customer.id)

        expect(customerDb).toStrictEqual(customer)
    })

    it("should throw error when street is missing", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        await expect(async () => {
            const useCase = new UpdateCustomerUseCase(customerRepository)

            await customerRepository.create(customer)

            input.address!.street = ""

            await useCase.execute(input)
        }).rejects.toThrow(
            new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.STREET)
        )

        const customerDb = await customerRepository.find(customer.id)

        expect(customerDb).toStrictEqual(customer)
    })
})
