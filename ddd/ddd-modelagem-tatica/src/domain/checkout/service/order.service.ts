import { v4 as uuid } from "uuid"
import Customer from "../../customer/entity/customer-interface"
import OrderImpl from "../entity/order"
import OrderItem from "../entity/order_item-interface"
import Order from "../entity/order-interface"

export default class OrderService {
    static total(orders: Order[]) {
        return orders.reduce((acc, order) => acc + order.total(), 0)
    }

    static placeOrder(customer: Customer, items: OrderItem[]): Order {
        if (!items || items.length === 0) throw new Error("Items is required")

        const order = new OrderImpl(uuid(), customer.id, items)

        customer.addRewardPoints(order.total() / 2)

        return order
    }
}
