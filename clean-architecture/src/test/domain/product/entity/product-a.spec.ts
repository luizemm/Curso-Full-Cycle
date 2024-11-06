import ProductA from "../../../../domain/product/entity/product-a"
import { ERROR_MESSAGES } from "../../../../error/error.messages"

describe("Product A unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => new ProductA("", "Product 1", 100)).toThrow(
            expect.objectContaining({
                message: `${ProductA.ERROR_CONTEXT}: ${ERROR_MESSAGES.REQUIRED_FIELD.ID}`,
            })
        )
    })

    it("should throw error when name is empty", () => {
        expect(() => new ProductA("123", "", 100)).toThrow(
            expect.objectContaining({
                message: `${ProductA.ERROR_CONTEXT}: ${ERROR_MESSAGES.REQUIRED_FIELD.NAME}`,
            })
        )
    })

    it("should throw error when price less than 0", () => {
        expect(() => new ProductA("123", "123", -1)).toThrow(
            expect.objectContaining({
                message: `${ProductA.ERROR_CONTEXT}: ${ERROR_MESSAGES.PRICE_MUST_BE_GREATER_EQUAL_ZERO}`,
            })
        )
    })

    it("should throw error when name, id and price are invalid", () => {
        expect(() => new ProductA("", "", -1)).toThrow(
            expect.objectContaining({
                message:
                    `${ProductA.ERROR_CONTEXT}: ${ERROR_MESSAGES.REQUIRED_FIELD.ID}, ` +
                    `${ProductA.ERROR_CONTEXT}: ${ERROR_MESSAGES.REQUIRED_FIELD.NAME}, ` +
                    `${ProductA.ERROR_CONTEXT}: ${ERROR_MESSAGES.PRICE_MUST_BE_GREATER_EQUAL_ZERO}`,
            })
        )
    })

    it("should change name", () => {
        const newName = "Product 2"
        const product = new ProductA("123", "Product 1", 123)

        product.changeName(newName)

        expect(product.name).toBe(newName)
    })

    it("should change price", () => {
        const newPrice = 456
        const product = new ProductA("123", "Product 1", 123)

        product.changePrice(newPrice)

        expect(product.price).toBe(newPrice)
    })
})
