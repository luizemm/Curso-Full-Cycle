import Validator from "../../@shared/validator/validator-interface"
import Product from "../entity/product-interface"
import ProductType from "../enum/product-type.enum"
import ProductAYupValidator from "../validator/product-a.yup.validator"
import ProductBYupValidator from "../validator/product-b.yup.validator"

export default class ProductValidatorFactory {
    static create(type: ProductType): Validator<Product> {
        switch (type) {
            case ProductType.PRODUCT_A:
                return new ProductAYupValidator()
            case ProductType.PRODUCT_B:
                return new ProductBYupValidator()
        }
    }
}
