import CustomerImpl from "../../../../domain/customer/entity/customer"
import OrderImpl from "../../../../domain/checkout/entity/order"
import OrderItemImpl from "../../../../domain/checkout/entity/order_item"
import OrderService from "../../../../domain/checkout/service/order.service"

describe("Order service unit tests", () => {
    it("should get total of all orders", () => {
        const item1 = new OrderItemImpl("i1", "item 1", 20, "p1", 5)
        const item2 = new OrderItemImpl("i2", "item 2", 40, "p2", 2)
        const order1 = new OrderImpl("1", "c1", [item1, item2])

        const item3 = new OrderItemImpl("i3", "item 3", 50, "p3", 1)
        const item4 = new OrderItemImpl("i4", "item 4", 12, "p4", 4)
        const order2 = new OrderImpl("2", "c2", [item3, item4])

        const orders = [order1, order2]

        expect(OrderService.total(orders)).toBe(278)
    })

    it("should place an order", () => {
        const customer = new CustomerImpl("1", "Customer 1")
        const item1 = new OrderItemImpl("i1", "item 1", 20, "p1", 5)

        const order = OrderService.placeOrder(customer, [item1])

        expect(customer.rewardPoints).toBe(50)
        expect(order.total()).toBe(100)
    })

    it("should throw error if items is empty when place an order", () => {
        expect(() => {
            const customer = new CustomerImpl("1", "Customer 1")

            OrderService.placeOrder(customer, [])
        }).toThrow("Items is required")
    })
})
