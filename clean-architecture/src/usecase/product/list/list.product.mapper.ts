import Product from "../../../domain/product/entity/product-interface"
import { OutputListProductDto, ProductDto } from "./list.product.dto"

export default class ListProductMapper {
    static toOutput(products: Product[]): OutputListProductDto {
        return {
            products: products.map(
                product =>
                    ({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                    }) as ProductDto
            ),
        }
    }
}
