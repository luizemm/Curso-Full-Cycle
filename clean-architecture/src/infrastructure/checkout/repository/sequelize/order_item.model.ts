import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript"
import ProductModel from "../../../product/repository/sequelize/product.model"
import OrderModel from "./order.model"
import DatabaseTable from "../../../@shared/repository/tables.enum"

@Table({
    tableName: DatabaseTable.ORDER_ITEM,
    timestamps: false,
})
export default class OrderItemModel extends Model {
    @PrimaryKey
    @Column
    declare id: string

    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    declare product_id: string

    @BelongsTo(() => ProductModel)
    declare product: ProductModel

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    declare order_id: string

    @BelongsTo(() => OrderModel)
    declare order: Awaited<OrderModel>

    @Column({ allowNull: false })
    declare name: string

    @Column({ allowNull: false })
    declare price: number

    @Column({ allowNull: false })
    declare quantity: number
}
