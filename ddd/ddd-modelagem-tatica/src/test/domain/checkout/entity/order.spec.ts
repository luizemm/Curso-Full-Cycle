import OrderImpl from "../../../../domain/checkout/entity/order"
import OrderItemImpl from "../../../../domain/checkout/entity/order_item"

describe("Order unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => new OrderImpl("", "123", [])).toThrow("Id is required")
    })

    it("should throw error when customerId is empty", () => {
        expect(() => new OrderImpl("1", "", [])).toThrow(
            "CustomerId is required"
        )
    })

    it("should throw error when items is empty", () => {
        expect(() => new OrderImpl("1", "123", [])).toThrow(
            "Items are required"
        )
    })

    it("should calculate total", () => {
        const item1 = new OrderItemImpl("1", "item 1", 10, "p1", 2)
        const item2 = new OrderItemImpl("2", "Item 2", 24, "p2", 1)
        const item3 = new OrderItemImpl("3", "Item 3", 50, "p3", 2)
        const order1 = new OrderImpl("1", "1", [item1, item2])

        const total1 = order1.total()

        expect(total1).toBe(44)

        const order2 = new OrderImpl("2", "2", [item1, item2, item3])

        const total2 = order2.total()

        expect(total2).toBe(144)
    })
})
