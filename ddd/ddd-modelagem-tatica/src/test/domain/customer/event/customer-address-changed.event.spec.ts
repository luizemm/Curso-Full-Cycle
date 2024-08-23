import Address from "../../../../domain/customer/value-object/address"
import Customer from "../../../../domain/customer/entity/customer"
import EventDispatcher from "../../../../domain/@shared/event/dispatcher-interface.event"
import EventDispatcherImpl from "../../../../domain/@shared/event/dispatcher.event"
import CustomerAddressChangedEvent from "../../../../domain/customer/event/customer-address-changed.event"
import LogWhenCustomerAddressIsChanged from "../../../../domain/customer/event/handlers/log-when-customer-address-is-changed.handler"

describe("Customer address changed event", () => {
    it("should log the id, name and address of a customer when their address is changed", () => {
        const eventDispatcher = new EventDispatcherImpl()

        const logHandler = new LogWhenCustomerAddressIsChanged()

        const spyLogHandler = jest.spyOn(logHandler, "handle")
        const spyConsole = jest.spyOn(console, "log")

        eventDispatcher.register(CustomerAddressChangedEvent.name, logHandler)

        const customer = new Customer("1", "Customer 1")
        const address = new Address("Street 1", 123, "12345-678", "BH")

        const event = simulateCustomerAddressChangeUseCase(
            customer,
            address,
            eventDispatcher
        )

        expect(spyLogHandler).toHaveBeenCalledWith(event)
        expect(spyConsole).toHaveBeenCalledWith(
            `Customer address: ${customer.id}, ${customer.name} changed to: ${customer.address}`
        )
    })
})
function simulateCustomerAddressChangeUseCase(
    customer: Customer,
    address: Address,
    eventDispatcher: EventDispatcher
) {
    customer.changeAddress(address)

    const event = new CustomerAddressChangedEvent({
        id: customer.id,
        name: customer.name,
        address: customer.address,
    })

    eventDispatcher.notify(event)

    return event
}
