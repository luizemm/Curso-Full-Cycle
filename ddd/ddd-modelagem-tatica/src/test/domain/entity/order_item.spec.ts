import OrderItem from "../../../domain/entity/order_item"

describe("OrderItem unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => new OrderItem("", "item 1", 123, "p1", 10)).toThrow(
            "Id is required"
        )
    })

    it("should throw error when name is empty", () => {
        expect(() => new OrderItem("12", "", 123, "p1", 10)).toThrow(
            "Name is required"
        )
    })

    it("should throw error when price is less than 0", () => {
        expect(() => new OrderItem("12", "item 1", -1, "p1", 10)).toThrow(
            "Price must be greater than or equal 0"
        )
    })

    it("should throw error when productId is empty", () => {
        expect(() => new OrderItem("12", "item 1", 123, "", 10)).toThrow(
            "ProductId is required"
        )
    })

    it("should throw error if quantity is less than or equal 0", () => {
        expect(() => new OrderItem("1", "item 1", 10, "p1", 0)).toThrow(
            "Quantity must be greater than 0"
        )
    })

    it("should change quantity", () => {
        const orderItem = new OrderItem("1", "item 1", 10, "p1", 1)

        expect(orderItem.quantity).toBe(1)

        orderItem.changeQuantity(2)

        expect(orderItem.quantity).toBe(2)
    })
})
