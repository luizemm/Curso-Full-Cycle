import Customer from "../../../../domain/entity/customer"
import EventDispatcher from "../../../../domain/event/@shared/dispatcher-interface.event"
import EventDispatcherImpl from "../../../../domain/event/@shared/dispatcher.event"
import CustomerCreatedEvent from "../../../../domain/event/customer/customer-created.event"
import LogFirstMessageWhenCustomerIsCreatedHandler from "../../../../domain/event/customer/handlers/log-first-message-when-customer-is-created.handler"
import LogSecondMessageWhenCustomerIsCreatedHandler from "../../../../domain/event/customer/handlers/log-second-message-when-customer-is-created.handler"

describe("Customer created event", () => {
    it("should log when customer is created", () => {
        const eventDispatcher = new EventDispatcherImpl()

        const firstLogHandler =
            new LogFirstMessageWhenCustomerIsCreatedHandler()
        const secondLogHandler =
            new LogSecondMessageWhenCustomerIsCreatedHandler()

        const spyFirstLogHandler = jest.spyOn(firstLogHandler, "handle")
        const spySecondLogHandler = jest.spyOn(secondLogHandler, "handle")

        const spyConsole = jest.spyOn(console, "log")

        eventDispatcher.register(CustomerCreatedEvent.name, firstLogHandler)
        eventDispatcher.register(CustomerCreatedEvent.name, secondLogHandler)

        const event = simulateCustomerCreationUseCase(eventDispatcher)

        expect(spyFirstLogHandler).toHaveBeenCalledWith(event)
        expect(spyConsole).toHaveBeenCalledWith(
            "This is the first console.log of event: CustomerCreatedEvent"
        )

        expect(spySecondLogHandler).toHaveBeenCalledWith(event)
        expect(spyConsole).toHaveBeenCalledWith(
            "This is the second console.log of event: CustomerCreatedEvent"
        )
    })
})

function simulateCustomerCreationUseCase(
    eventDispatcher: EventDispatcher
): CustomerCreatedEvent {
    const customer = new Customer("1", "Customer 1")

    const event = new CustomerCreatedEvent({
        id: customer.id,
        name: customer.name,
    })

    eventDispatcher.notify(event)

    return event
}
