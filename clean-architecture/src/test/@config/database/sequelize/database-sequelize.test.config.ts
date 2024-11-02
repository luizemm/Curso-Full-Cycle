import { ModelCtor, Sequelize } from "sequelize-typescript"
import ValidationError from "../../../../error/validation.error"
import DatabaseTable from "../../../../infrastructure/@shared/repository/tables.enum"
import CustomerModel from "../../../../infrastructure/customer/repository/sequelize/customer.model"
import OrderModel from "../../../../infrastructure/checkout/repository/sequelize/order.model"
import OrderItemModel from "../../../../infrastructure/checkout/repository/sequelize/order_item.model"
import ProductModel from "../../../../infrastructure/product/repository/sequelize/product.model"
import Database from "../../../../infrastructure/database/database-interface"

const MODEL: Record<DatabaseTable, ModelCtor> = {
    customer: CustomerModel,
    order: OrderModel,
    order_item: OrderItemModel,
    product: ProductModel,
}

export default class SequelizeDatabaseTestConfig implements Database {
    private sequelize: Sequelize | undefined
    private readonly models: ModelCtor[]

    constructor(models: DatabaseTable[]) {
        this.models = models.map(tableName => MODEL[tableName])

        this.validate()
    }

    validate(): void {
        if (!this.models) throw new ValidationError("Models are required")
    }

    async init(): Promise<void> {
        this.sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        this.sequelize.addModels(this.models)
        await this.sequelize.sync()
    }
    async close(): Promise<void> {
        if (!this.sequelize) throw new Error("Database not initialized")
        await this.sequelize.close()
    }
}
