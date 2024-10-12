import Event from "../../@shared/event/event-interface"

export default class CustomerCreatedEvent implements Event {
    dateTimeOcurred: Date
    eventData: any

    constructor(eventData: any) {
        this.dateTimeOcurred = new Date()
        this.eventData = eventData
    }
}