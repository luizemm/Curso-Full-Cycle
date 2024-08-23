import Address from "../../../../domain/customer/value-object/address"
import Customer from "../../../../domain/customer/entity/customer"

describe("Customer unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => new Customer("", "Fulano")).toThrow("Id is required")
    })

    it("should throw error when name is empty", () => {
        expect(() => new Customer("123", "")).toThrow("Name is required")
    })

    it("should change name", () => {
        // Arrange
        const newName = "Ciclano"
        const customer = new Customer("123", "Fulano")

        // Act
        customer.changeName(newName)

        // Assert
        expect(customer.name).toBe(newName)
    })

    it("should activate customer", () => {
        // Arrange
        const customer = new Customer("1", "Customer 1")
        const address = new Address("Rua 1", 123, "12345-678", "Belo Horizonte")
        customer.changeAddress(address)

        // Act
        customer.activate()

        // Assert
        expect(customer.isActive()).toBe(true)
    })

    it("should deactivate customer", () => {
        // Arrange
        const customer = new Customer("1", "Customer 1")
        const address = new Address("Rua 1", 123, "12345-678", "Belo Horizonte")
        customer.changeAddress(address)

        // Act
        customer.deactivate()

        // Assert
        expect(customer.isActive()).toBe(false)
    })

    it("should throw error if address is undefined when activate a customer", () => {
        expect(() => {
            const customer = new Customer("1", "Customer 1")
            customer.activate()
        }).toThrow("Address is mandatory to activate a customer")
    })

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1")

        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(10)

        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(20)
    })
})
