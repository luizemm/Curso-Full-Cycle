import Product from "../entity/product"

export default class ProductService {
    static increasePrice(products: Product[], percentage: number) {
        return products.forEach(product =>
            product.changePrice(product.price * (1 + percentage / 100))
        )
    }
}
