import Customer from "../../../domain/entity/customer"
import Order from "../../../domain/entity/order"
import OrderItem from "../../../domain/entity/order_item"
import OrderService from "../../../domain/service/order.service"

describe("Order service unit tests", () => {
    it("should get total of all orders", () => {
        const item1 = new OrderItem("i1", "item 1", 20, "p1", 5)
        const item2 = new OrderItem("i2", "item 2", 40, "p2", 2)
        const order1 = new Order("1", "c1", [item1, item2])

        const item3 = new OrderItem("i3", "item 3", 50, "p3", 1)
        const item4 = new OrderItem("i4", "item 4", 12, "p4", 4)
        const order2 = new Order("2", "c2", [item3, item4])

        const orders = [order1, order2]

        expect(OrderService.total(orders)).toBe(278)
    })

    it("should place an order", () => {
        const customer = new Customer("1", "Customer 1")
        const item1 = new OrderItem("i1", "item 1", 20, "p1", 5)

        const order = OrderService.placeOrder(customer, [item1])

        expect(customer.rewardPoints).toBe(50)
        expect(order.total()).toBe(100)
    })

    it("should throw error if items is empty when place an order", () => {
        expect(() => {
            const customer = new Customer("1", "Customer 1")

            OrderService.placeOrder(customer, [])
        }).toThrow("Items is required")
    })
})