import Event from "./event-interface"

export default interface EventHandler<T extends Event = Event> {
    handle(event: T): void
}
