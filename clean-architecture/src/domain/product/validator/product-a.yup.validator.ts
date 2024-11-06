import ProductA from "../entity/product-a"
import ProductYupValidator from "./product.abstract.yup.validator"

export default class ProductAYupValidator extends ProductYupValidator<ProductA> {
    constructor() {
        super(ProductA.ERROR_CONTEXT)
    }
}
