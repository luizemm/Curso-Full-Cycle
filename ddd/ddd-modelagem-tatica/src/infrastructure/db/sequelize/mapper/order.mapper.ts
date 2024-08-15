import Order from "../../../../domain/entity/order"
import OrderItem from "../../../../domain/entity/order_item"
import OrderModel from "../model/order.model"

export default class OrderMapper {
    static toEntity(model: OrderModel): Order {
        const items = model.items.map(
            itemModel =>
                new OrderItem(
                    itemModel.id,
                    itemModel.name,
                    itemModel.price,
                    itemModel.product_id,
                    itemModel.quantity
                )
        )

        return new Order(model.id, model.customer_id, items)
    }
}
