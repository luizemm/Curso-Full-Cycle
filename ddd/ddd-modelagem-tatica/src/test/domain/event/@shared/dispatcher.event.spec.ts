import EventDispatcherImpl from "../../../../domain/event/@shared/dispatcher.event"
import SendEmailWhenProductIsCreatedHandler from "../../../../domain/event/product/handlers/send-email-when-product-is-created.handler"
import ProductCreatedEvent from "../../../../domain/event/product/product-created.event"

describe("Dispatcher event test", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcherImpl()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        const eventName = "ProductCreatedEvent"

        eventDispatcher.register(eventName, eventHandler)

        expect(eventDispatcher.eventHandlers[eventName]).toBeDefined()
        expect(eventDispatcher.eventHandlers[eventName].length).toBe(1)
        expect(eventDispatcher.eventHandlers[eventName][0]).toEqual(
            eventHandler
        )
    })

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcherImpl()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        const eventName = "ProductCreatedEvent"

        eventDispatcher.register(eventName, eventHandler)

        expect(eventDispatcher.eventHandlers[eventName]).toBeDefined()
        expect(eventDispatcher.eventHandlers[eventName].length).toBe(1)

        eventDispatcher.unregister(eventName, eventHandler)

        expect(eventDispatcher.eventHandlers[eventName].length).toBe(0)
    })

    it("should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcherImpl()
        const eventHandler1 = new SendEmailWhenProductIsCreatedHandler()
        const eventHandler2 = new SendEmailWhenProductIsCreatedHandler()

        const eventName1 = "ProductCreatedEvent"
        const eventName2 = "OtherEvent"

        eventDispatcher.register(eventName1, eventHandler1)
        eventDispatcher.register(eventName2, eventHandler2)

        expect(eventDispatcher.eventHandlers[eventName1]).toBeDefined()
        expect(eventDispatcher.eventHandlers[eventName1].length).toBe(1)

        expect(eventDispatcher.eventHandlers[eventName2]).toBeDefined()
        expect(eventDispatcher.eventHandlers[eventName2].length).toBe(1)

        eventDispatcher.unregisterAll()

        expect(eventDispatcher.eventHandlers[eventName1]).toBeUndefined()
        expect(eventDispatcher.eventHandlers[eventName2]).toBeUndefined()
    })

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcherImpl()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()
        const spyEventHandler = jest.spyOn(eventHandler, "handle")

        const eventName = "ProductCreatedEvent"

        eventDispatcher.register(eventName, eventHandler)

        const event = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        })

        eventDispatcher.notify(event)

        expect(spyEventHandler).toHaveBeenCalledWith(event)
    })
})
