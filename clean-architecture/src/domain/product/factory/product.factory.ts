import ProductA from "../entity/product-a"
import ProductB from "../entity/product-b"
import Product from "../entity/product-interface"
import ProductType from "../enum/product-type.enum"
import { v4 as uuid } from "uuid"

export default class ProductFactory {
    static create(type: ProductType, name: string, price: number): Product {
        switch (type) {
            case ProductType.PRODUCT_A:
                return new ProductA(uuid(), name, price)
            case ProductType.PRODUCT_B:
                return new ProductB(uuid(), name, price)
        }
    }
}
