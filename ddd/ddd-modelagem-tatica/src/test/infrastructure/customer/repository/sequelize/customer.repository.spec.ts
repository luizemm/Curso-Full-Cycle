import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../../../../infrastructure/customer/repository/sequelize/customer.model"
import Customer from "../../../../../domain/customer/entity/customer"
import CustomerRepositoryImpl from "../../../../../infrastructure/customer/repository/sequelize/customer.repository"
import Address from "../../../../../domain/customer/value-object/address"

describe("Customer repository test", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([CustomerModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const customer = new Customer("1", "customer 1")
        const address = new Address(
            "Street 1",
            123,
            "12345-678",
            "Belo Horizonte"
        )

        customer.changeAddress(address)

        await customerRepository.create(customer)

        const customerModel = await CustomerModel.findOne({
            where: { id: "1" },
        })

        expect(customerModel?.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.address!.street,
            number: customer.address!.number,
            zip: customer.address!.zip,
            city: customer.address!.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        })
    })

    it("should create a customer without address", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const customer = new Customer("1", "customer 1")

        await customerRepository.create(customer)

        const customerModel = await CustomerModel.findOne({
            where: { id: "1" },
        })

        expect(customerModel?.toJSON()).toEqual({
            id: customer.id,
            name: customer.name,
            street: customer.address?.street ?? null,
            number: customer.address?.number ?? null,
            zip: customer.address?.zip ?? null,
            city: customer.address?.city ?? null,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        })
    })

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const customer = new Customer("1", "customer 1")
        const address = new Address(
            "Street 1",
            123,
            "12345-678",
            "Belo Horizonte"
        )

        customer.changeAddress(address)

        await CustomerModel.create({
            id: customer.id,
            name: customer.name,
            street: customer.address?.street,
            number: customer.address?.number,
            zip: customer.address?.zip,
            city: customer.address?.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        })

        let customerModel = await CustomerModel.findOne({ where: { id: "1" } })

        expect(customerModel?.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.address!.street,
            number: customer.address!.number,
            zip: customer.address!.zip,
            city: customer.address!.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        })

        customer.changeName("customer 2")
        customer.activate()
        customer.addRewardPoints(10)

        customerRepository.update(customer)

        customerModel = await CustomerModel.findOne({ where: { id: "1" } })

        expect(customerModel?.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.address!.street,
            number: customer.address!.number,
            zip: customer.address!.zip,
            city: customer.address!.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        })
    })

    it("should find a customer by id", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const customer = new Customer("1", "customer 1")
        const address = new Address(
            "Street 1",
            123,
            "12345-678",
            "Belo Horizonte"
        )

        customer.changeAddress(address)

        const expectedCustomer = {
            id: customer.id,
            name: customer.name,
            street: customer.address?.street,
            number: customer.address?.number,
            zip: customer.address?.zip,
            city: customer.address?.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        }

        await CustomerModel.create(expectedCustomer)

        const customerResult = await customerRepository.find("1")

        expect({
            id: customerResult!.id,
            name: customerResult!.name,
            street: customerResult!.address?.street,
            number: customerResult!.address?.number,
            zip: customerResult!.address?.zip,
            city: customerResult!.address?.city,
            active: customerResult!.isActive(),
            rewardPoints: customerResult!.rewardPoints,
        }).toStrictEqual(expectedCustomer)
    })

    it("should return null when not found a customer by id", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const customer = new Customer("1", "customer 1")
        const address = new Address(
            "Street 1",
            123,
            "12345-678",
            "Belo Horizonte"
        )

        customer.changeAddress(address)

        await CustomerModel.create({
            id: customer.id,
            name: customer.name,
            street: customer.address?.street,
            number: customer.address?.number,
            zip: customer.address?.zip,
            city: customer.address?.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        })

        const customerResult = await customerRepository.find("2")

        expect(customerResult).toBeNull()
    })

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepositoryImpl()

        const customer1 = new Customer("1", "customer 1")
        const address1 = new Address(
            "Street 1",
            123,
            "12345-678",
            "Belo Horizonte"
        )
        customer1.changeAddress(address1)

        const customer2 = new Customer("2", "customer 2")
        const address2 = new Address("Street 2", 123, "12345-678", "São Paulo")
        customer2.changeAddress(address2)

        const expectedCustomers = [customer1, customer2]

        const entityToModel = (customer: Customer) => ({
            id: customer.id,
            name: customer.name,
            street: customer.address?.street,
            number: customer.address?.number,
            zip: customer.address?.zip,
            city: customer.address?.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        })

        expectedCustomers.forEach(
            async customer =>
                await CustomerModel.create(entityToModel(customer))
        )

        const customersResult = await customerRepository.findAll()

        expect(customersResult).toEqual(expectedCustomers)
    })
})
