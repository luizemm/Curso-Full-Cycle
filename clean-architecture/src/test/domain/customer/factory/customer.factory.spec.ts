import CustomerFactory from "../../../../domain/customer/factory/customer.factory"
import AddressImpl from "../../../../domain/customer/value-object/address"

describe("Customer factory unit test", () => {
    it("should create a customer", () => {
        const name = "John"
        const customer = CustomerFactory.create(name)

        expect(customer.id).toBeDefined()
        expect(customer.name).toBe(name)
        expect(customer.address).toBeUndefined()
    })

    it("should create a customer with an address", () => {
        const name = "John"
        const address = new AddressImpl(
            "Street 1",
            1,
            "12345-678",
            "Belo Horizonte"
        )
        const customer = CustomerFactory.createWithAddress(name, address)

        expect(customer.id).toBeDefined()
        expect(customer.name).toBe(name)
        expect(customer.address).toBe(address)
    })
})
