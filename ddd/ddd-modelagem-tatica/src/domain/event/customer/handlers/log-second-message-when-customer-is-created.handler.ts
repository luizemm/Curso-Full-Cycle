import EventHandler from "../../@shared/handler-interface.event"
import CustomerCreatedEvent from "../customer-created.event"

export default class LogSecondMessageWhenCustomerIsCreatedHandler
    implements EventHandler<CustomerCreatedEvent>
{
    handle(event: CustomerCreatedEvent): void {
        console.log(
            `This is the second console.log of event: ${event.constructor.name}`
        )
    }
}
