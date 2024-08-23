import Event from "./event-interface"
import EventHandler from "./handler-interface.event"

export default interface EventDispatcher {
    notify(event: Event): void
    register(eventName: string, eventHandler: EventHandler): void
    unregister(eventName: string, eventHandler: EventHandler): void
    unregisterAll(): void
}
