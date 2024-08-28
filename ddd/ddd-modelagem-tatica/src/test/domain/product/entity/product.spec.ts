import ProductA from "../../../../domain/product/entity/product-a"

describe("Product unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => new ProductA("", "Product 1", 100)).toThrow(
            "Id is required"
        )
    })

    it("should throw error when name is empty", () => {
        expect(() => new ProductA("123", "", 100)).toThrow("Name is required")
    })

    it("should throw error when price less than 0", () => {
        expect(() => new ProductA("123", "123", -1)).toThrow(
            "Price must be greater than or equal 0"
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
