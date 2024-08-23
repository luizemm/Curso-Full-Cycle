import EventHandler from "../../../@shared/event/handler-interface.event"
import ProductCreatedEvent from "../product-created.event"

export default class SendEmailWhenProductIsCreatedHandler
    implements EventHandler<ProductCreatedEvent>
{
    handle(_event: ProductCreatedEvent): void {
        console.log("Sending email...")
    }
}
