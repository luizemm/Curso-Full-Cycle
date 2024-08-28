import ProductA from "../../../../domain/product/entity/product-a"
import ProductService from "../../../../domain/product/service/product.service"

describe("Product service unit tests", () => {
    it("should change the prices of all products", () => {
        const product1 = new ProductA("1", "product 1", 10)
        const product2 = new ProductA("2", "product 2", 40)
        const product3 = new ProductA("3", "product 3", 112)

        const products = [product1, product2, product3]

        ProductService.increasePrice(products, 100)

        expect(product1.price).toBe(20)
        expect(product2.price).toBe(80)
        expect(product3.price).toBe(224)
    })
})
