import { Sequelize, ModelCtor } from "sequelize-typescript"
import Database from "./database-interface"
import CustomerModel from "../customer/repository/sequelize/customer.model"
import OrderModel from "../checkout/repository/sequelize/order.model"
import OrderItemModel from "../checkout/repository/sequelize/order_item.model"
import ProductModel from "../product/repository/sequelize/product.model"
import DatabaseTable from "../@shared/repository/tables.enum"

export const MODEL: Record<DatabaseTable, ModelCtor> = {
    customer: CustomerModel,
    order: OrderModel,
    order_item: OrderItemModel,
    product: ProductModel,
}

export default class SequelizeDatabase implements Database {
    private sequelize: Sequelize | undefined

    async init(): Promise<void> {
        this.sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        this.sequelize.addModels(Object.values(MODEL))
        await this.sequelize.sync()
    }
    async close(): Promise<void> {
        if (this.sequelize) await this.sequelize.close()
    }
}
