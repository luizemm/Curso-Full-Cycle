import Order from "../../../../domain/checkout/entity/order-interface"
import OrderRepository from "../../../../domain/checkout/repository/order-interface.repository"
import { getDeltas } from "../../../@shared/repository/db.utils"
import OrderMapper from "./order.mapper"
import OrderModel from "./order.model"
import OrderItemModel from "./order_item.model"

export default class OrderRepositoryImpl implements OrderRepository {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                items: entity.items.map(item => ({
                    id: item.id,
                    product_id: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        )
    }
    async update(entity: Order): Promise<void> {
        await OrderModel.sequelize!.transaction(async transaction => {
            const sourceEntity = await OrderModel.findOne({
                where: { id: entity.id },
                include: [OrderItemModel],
            })

            if (!sourceEntity) throw new Error("Order not found with given id")

            const deltas = getDeltas(
                sourceEntity.items.map(item => ({
                    id: item.id,
                    product_id: item.product_id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    order_id: entity.id,
                })),
                entity.items.map(item => ({
                    id: item.id,
                    product_id: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    order_id: entity.id,
                }))
            )

            await Promise.all([
                ...deltas.added.map(item =>
                    OrderItemModel.create(item, { transaction })
                ),
                ...deltas.changed.map(item =>
                    OrderItemModel.update(
                        { ...item, id: undefined },
                        { where: { id: item.id }, transaction }
                    )
                ),
                ...deltas.deleted.map(item =>
                    OrderItemModel.destroy({
                        where: { id: item.id },
                        transaction,
                    })
                ),
            ])

            await OrderModel.update(
                {
                    customer_id: entity.customerId,
                    items: entity.items.map(item => ({
                        id: item.id,
                        product_id: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                },
                {
                    where: { id: entity.id },
                    transaction,
                }
            )
        })
    }
    async find(id: string): Promise<Order | null> {
        const orderModel = await OrderModel.findOne({
            where: { id },
            include: OrderItemModel,
        })

        if (!orderModel) return null

        return OrderMapper.toEntity(orderModel)
    }
    async findAll(): Promise<Order[]> {
        const ordersModel = await OrderModel.findAll({
            include: { model: OrderItemModel },
        })

        return ordersModel.map(order => OrderMapper.toEntity(order))
    }
}
