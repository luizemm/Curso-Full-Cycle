import Product from "../../../domain/product/entity/product-interface"
import { OutputUpdateProductDto } from "./update.product.dto"

export default class UpdateProductMapper {
    static toOutput(product: Product): OutputUpdateProductDto {
        return {
            id: product.id,
            name: product.name,
            price: product.price,
        } as OutputUpdateProductDto
    }
}
