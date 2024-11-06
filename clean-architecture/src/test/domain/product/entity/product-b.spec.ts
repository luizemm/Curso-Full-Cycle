import ProductB from "../../../../domain/product/entity/product-b"
import { ERROR_MESSAGES } from "../../../../error/error.messages"

describe("Product B unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => new ProductB("", "Product 1", 100)).toThrow(
            expect.objectContaining({
                message: `${ProductB.ERROR_CONTEXT}: ${ERROR_MESSAGES.REQUIRED_FIELD.ID}`,
            })
        )
    })

    it("should throw error when name is empty", () => {
        expect(() => new ProductB("123", "", 100)).toThrow(
            expect.objectContaining({
                message: `${ProductB.ERROR_CONTEXT}: ${ERROR_MESSAGES.REQUIRED_FIELD.NAME}`,
            })
        )
    })

    it("should throw error when price less than 0", () => {
        expect(() => new ProductB("123", "123", -1)).toThrow(
            expect.objectContaining({
                message: `${ProductB.ERROR_CONTEXT}: ${ERROR_MESSAGES.PRICE_MUST_BE_GREATER_EQUAL_ZERO}`,
            })
        )
    })

    it("should throw error when name, id and price are invalid", () => {
        expect(() => new ProductB("", "", -1)).toThrow(
            expect.objectContaining({
                message:
                    `${ProductB.ERROR_CONTEXT}: ${ERROR_MESSAGES.REQUIRED_FIELD.ID}, ` +
                    `${ProductB.ERROR_CONTEXT}: ${ERROR_MESSAGES.REQUIRED_FIELD.NAME}, ` +
                    `${ProductB.ERROR_CONTEXT}: ${ERROR_MESSAGES.PRICE_MUST_BE_GREATER_EQUAL_ZERO}`,
            })
        )
    })

    it("should change name", () => {
        const newName = "Product 2"
        const product = new ProductB("123", "Product 1", 123)

        product.changeName(newName)

        expect(product.name).toBe(newName)
    })

    it("should change price", () => {
        const newPrice = 456
        const product = new ProductB("123", "Product 1", 123)

        product.changePrice(newPrice)

        expect(product.price).toBe(newPrice * 2)
    })
})
