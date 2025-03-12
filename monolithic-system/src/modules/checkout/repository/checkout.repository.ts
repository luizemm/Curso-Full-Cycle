import Id from "../../@shared/domain/value-object/id.value-object"
import ClientModel from "../../client-adm/repository/client.model"
import ProductModel from "../../product-adm/repository/product.model"
import Client from "../domain/client.entity"
import Order from "../domain/order.entity"
import Product from "../domain/product.entity"
import CheckoutGateway from "../gateway/checkout.gateway"
import OrderModel from "./order.model"

export default class CheckoutRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        const dateNow = new Date()

        const orderModel = await OrderModel.create({
            id: order.id!.id,
            client_id: order.client.id!.id,
            status: order.status,
            createdAt: dateNow,
            updatedAt: dateNow,
        })

        await orderModel.$add(
            "products",
            order.products.map(product => product.id!.id)
        )

        order.createdAt = dateNow
        order.updatedAt = dateNow
    }
    async findOrder(id: string): Promise<Order | null> {
        const order = await OrderModel.findOne({
            where: { id },
            include: [ClientModel, ProductModel],
        })

        if (!order) return null

        const client = new Client({
            id: new Id(order.client.id),
            name: order.client.name,
            email: order.client.email,
            address: order.client.street,
            document: order.client.document,
        })

        const products = order.products.map(
            product =>
                new Product({
                    id: new Id(product.id),
                    name: product.name,
                    description: product.description,
                    salesPrice: product.purchasePrice,
                })
        )

        return new Order({
            id: new Id(order.id),
            client,
            products,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        })
    }
}
