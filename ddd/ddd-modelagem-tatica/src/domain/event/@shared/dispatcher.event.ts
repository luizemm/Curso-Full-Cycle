import EventDispatcher from "./dispatcher-interface.event"
import Event from "./event-interface"
import EventHandler from "./handler-interface.event"

type EventRegisters = {
    [eventName: string]: EventHandler[]
}

export default class EventDispatcherImpl implements EventDispatcher {
    private _eventHandlers: EventRegisters = {}

    notify(event: Event): void {
        const eventName = event.constructor.name

        if (this._eventHandlers[eventName]) {
            this._eventHandlers[eventName].forEach(handler =>
                handler.handle(event)
            )
        }
    }
    register(eventName: string, eventHandler: EventHandler): void {
        if (!this.eventHandlers[eventName]) this.eventHandlers[eventName] = []
        this._eventHandlers[eventName].push(eventHandler)
    }
    unregister(eventName: string, eventHandler: EventHandler): void {
        if (this.eventHandlers[eventName]) {
            const handlerIndexToRemove =
                this._eventHandlers[eventName].indexOf(eventHandler)

            if (handlerIndexToRemove != -1)
                this._eventHandlers[eventName].splice(handlerIndexToRemove, 1)
        }
    }
    unregisterAll(): void {
        this._eventHandlers = {}
    }

    get eventHandlers(): EventRegisters {
        return this._eventHandlers
    }
}
