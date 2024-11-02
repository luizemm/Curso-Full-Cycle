import { ERROR_MESSAGES } from "../../../../error/error.messages"
import ValidationError from "../../../../error/validation.error"
import DatabaseTable from "../../../../infrastructure/@shared/repository/tables.enum"
import CustomerRepositoryImpl from "../../../../infrastructure/customer/repository/sequelize/customer.repository"
import {
    InputCreateCustomerDto,
    OutputCreateCustomerDto,
} from "../../../../usecase/customer/create/create.customer.dto"
import CreateCustomerUseCase from "../../../../usecase/customer/create/create.customer.usecase"
import { createDbInstance } from "../../../@config/database/database.test.config"
import Database from "../../../../infrastructure/database/database-interface"

let input: InputCreateCustomerDto

describe("Integration test create customer use case", () => {
    let db: Database

    beforeEach(async () => {
        db = createDbInstance([DatabaseTable.CUSTOMER])

        await db.init()

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

    afterEach(async () => {
        await db.close()
    })

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const useCase = new CreateCustomerUseCase(customerRepository)

        const output = await useCase.execute(input)
        const customerDb = await customerRepository.find(output.id)

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

        expect(customerDb).not.toBeNull()
        expect({
            name: customerDb!.name,
            address: {
                street: customerDb!.address!.street,
                number: customerDb!.address!.number,
                zip: customerDb!.address!.zip,
                city: customerDb!.address!.city,
            },
        } as InputCreateCustomerDto).toStrictEqual(input)
    })

    it("should throw error when name is missing", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        await expect(async () => {
            const customerCreateUseCase = new CreateCustomerUseCase(
                customerRepository
            )

            input.name = ""

            await customerCreateUseCase.execute(input)
        }).rejects.toThrow(
            new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.NAME)
        )

        const customers = await customerRepository.findAll()

        expect(customers.length).toBe(0)
    })

    it("should throw error when street is missing", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        await expect(async () => {
            const customerCreateUseCase = new CreateCustomerUseCase(
                customerRepository
            )

            input.address!.street = ""

            await customerCreateUseCase.execute(input)
        }).rejects.toThrow(
            new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.STREET)
        )

        const customers = await customerRepository.findAll()

        expect(customers.length).toBe(0)
    })
})
