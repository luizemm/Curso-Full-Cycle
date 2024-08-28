import OrderImpl from "../entity/order"
import Order from "../entity/order-interface"
import OrderItemImpl from "../entity/order_item"
import { v4 as uuid } from "uuid"

export interface OrderFactoryProps {
    customerId: string
    items: {
        name: string
        productId: string
        quantity: number
        price: number
    }[]
}

export default class OrderFactory {
    static create(props: OrderFactoryProps): Order {
        const items = props.items.map(
            item =>
                new OrderItemImpl(
                    uuid(),
                    item.name,
                    item.price,
                    item.productId,
                    item.quantity
                )
        )

        return new OrderImpl(uuid(), props.customerId, items)
    }
}
