import EventHandler from "../../../@shared/event/handler-interface.event"
import CustomerCreatedEvent from "../customer-created.event"

export default class LogFirstMessageWhenCustomerIsCreatedHandler
    implements EventHandler<CustomerCreatedEvent>
{
    handle(event: CustomerCreatedEvent): void {
        console.log(
            `This is the first console.log of event: ${event.constructor.name}`
        )
    }
}
