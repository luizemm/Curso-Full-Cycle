import OrderImpl from "../../../../domain/checkout/entity/order"
import Order from "../../../../domain/checkout/entity/order-interface"
import OrderItemImpl from "../../../../domain/checkout/entity/order_item"
import OrderModel from "./order.model"

export default class OrderMapper {
    static toEntity(model: OrderModel): Order {
        const items = model.items.map(
            itemModel =>
                new OrderItemImpl(
                    itemModel.id,
                    itemModel.name,
                    itemModel.price,
                    itemModel.product_id,
                    itemModel.quantity
                )
        )

        return new OrderImpl(model.id, model.customer_id, items)
    }
}
