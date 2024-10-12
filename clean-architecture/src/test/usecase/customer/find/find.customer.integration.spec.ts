import CustomerImpl from "../../../../domain/customer/entity/customer"
import AddressImpl from "../../../../domain/customer/value-object/address"
import { ERROR_MESSAGES } from "../../../../error/error.messages"
import NotFoundError from "../../../../error/not-found.error"
import DatabaseTable from "../../../../infrastructure/@shared/repository/tables.enum"
import CustomerRepositoryImpl from "../../../../infrastructure/customer/repository/sequelize/customer.repository"
import {
    InputFindCustomerDto,
    OutputFindCustomerDto,
} from "../../../../usecase/customer/find/find.customer.dto"
import FindCustomerUseCase from "../../../../usecase/customer/find/find.customer.usecase"
import {
    createDbInstance,
    DatabaseTestConfig,
} from "../../../@config/database/database.test.config"

describe("Integration test find customer use case", () => {
    let db: DatabaseTestConfig

    beforeEach(async () => {
        db = createDbInstance([DatabaseTable.CUSTOMER])

        await db.init()
    })

    afterEach(async () => {
        await db.close()
    })

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepositoryImpl()

        const useCase = new FindCustomerUseCase(customerRepository)
        const customer = new CustomerImpl("123", "John")
        const address = new AddressImpl("Street", 123, "city", "Zip")
        customer.changeAddress(address)

        await customerRepository.create(customer)

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

    it("should throw error if not find a customer", async () => {
        await expect(async () => {
            const customerRepository = new CustomerRepositoryImpl()
            const useCase = new FindCustomerUseCase(customerRepository)

            await useCase.execute({ id: "123" } as InputFindCustomerDto)
        }).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.CUSTOMER_NOT_FOUND))
    })
})
