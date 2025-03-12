import {
    BelongsTo,
    BelongsToMany,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript"
import ClientModel from "../../client-adm/repository/client.model"
import ProductModel from "../../product-adm/repository/product.model"
import OrderProductsModel from "./order.items.model"

@Table({
    tableName: "orders",
    timestamps: false,
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string

    @ForeignKey(() => ClientModel)
    @Column({ allowNull: false })
    declare client_id: string

    @BelongsTo(() => ClientModel)
    declare client: Awaited<ClientModel>

    @BelongsToMany(() => ProductModel, () => OrderProductsModel)
    declare products: ProductModel[]

    @Column({ allowNull: false })
    declare status: string

    @Column({ allowNull: false })
    declare createdAt: Date

    @Column({ allowNull: false })
    declare updatedAt: Date
}
