import {
    BelongsTo,
    Column,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript"
import CustomerModel from "../../../customer/repository/sequelize/customer.model"
import OrderItemModel from "./order_item.model"
import DatabaseTable from "../../../@shared/repository/tables.enum"

@Table({
    tableName: DatabaseTable.ORDER,
    timestamps: false,
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column
    declare id: string

    @ForeignKey(() => CustomerModel)
    @Column({ allowNull: false })
    declare customer_id: string

    @BelongsTo(() => CustomerModel)
    declare customer: CustomerModel

    @HasMany(() => OrderItemModel)
    declare items: OrderItemModel[]
}
