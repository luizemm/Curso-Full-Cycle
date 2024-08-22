import EventHandler from "../../@shared/handler-interface.event"
import CustomerAddressChangedEvent from "../customer-address-changed.event"

export default class LogWhenCustomerAddressIsChanged
    implements EventHandler<CustomerAddressChangedEvent>
{
    handle(event: CustomerAddressChangedEvent): void {
        const customer = event.eventData
        console.log(
            `Customer address: ${customer.id}, ${customer.name} changed to: ${customer.address}`
        )
    }
}
