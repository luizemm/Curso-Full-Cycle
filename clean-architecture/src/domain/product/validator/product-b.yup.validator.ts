import ProductB from "../entity/product-b"
import ProductYupValidator from "./product.abstract.yup.validator"

export default class ProductBYupValidator extends ProductYupValidator<ProductB> {
    constructor() {
        super(ProductB.ERROR_CONTEXT)
    }
}
