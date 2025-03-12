import { Column, ForeignKey, Model, Table } from "sequelize-typescript"
import ProductModel from "../../product-adm/repository/product.model"
import OrderModel from "./order.model"

@Table({
    tableName: "order-products",
    timestamps: false,
})
export default class OrderProductsModel extends Model {
    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    declare product_id: string

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    declare order_id: string
}
