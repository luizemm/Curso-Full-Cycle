import Product from "../../../../domain/product/entity/product"
import ProductService from "../../../../domain/product/service/product.service"

describe("Product service unit tests", () => {
    it("should change the prices of all products", () => {
        const product1 = new Product("1", "product 1", 10)
        const product2 = new Product("2", "product 2", 40)
        const product3 = new Product("3", "product 3", 112)

        const products = [product1, product2, product3]

        ProductService.increasePrice(products, 100)

        expect(product1.price).toBe(20)
        expect(product2.price).toBe(80)
        expect(product3.price).toBe(224)
    })
})
