import { v4 as uuid } from "uuid"
import OrderFactory, {
    OrderFactoryProps,
} from "../../../../domain/checkout/factory/order.factory"

describe("Order factory unit test", () => {
    it("should create an order", () => {
        const orderProps: OrderFactoryProps = {
            customerId: uuid(),
            items: [
                {
                    name: "Product 1",
                    productId: uuid(),
                    quantity: 2,
                    price: 100,
                },
            ],
        }

        const order = OrderFactory.create(orderProps)

        expect(order.id).toBeDefined()
        expect(order.customerId).toBe(orderProps.customerId)
        expect(order.items.length).toBe(orderProps.items.length)
    })
})
