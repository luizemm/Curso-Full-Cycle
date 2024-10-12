import ProductA from "../../../../domain/product/entity/product-a"
import ProductB from "../../../../domain/product/entity/product-b"
import ProductType from "../../../../domain/product/enum/product-type.enum"
import ProductFactory from "../../../../domain/product/factory/product.factory"

describe("Product factory unit test", () => {
    it("should create a product type A", () => {
        const name = "Product A"
        const price = 100
        const product = ProductFactory.create(
            ProductType.PRODUCT_A,
            name,
            price
        )

        expect(product.id).toBeDefined()
        expect(product.name).toBe(name)
        expect(product.price).toBe(price)
        expect(product.constructor.name).toBe(ProductA.name)
    })

    it("should create a product type B", () => {
        const name = "Product B"
        const price = 100
        const product = ProductFactory.create(
            ProductType.PRODUCT_B,
            name,
            price
        )

        expect(product.id).toBeDefined()
        expect(product.name).toBe(name)
        expect(product.price).toBe(price * 2)
        expect(product.constructor.name).toBe(ProductB.name)
    })
})
