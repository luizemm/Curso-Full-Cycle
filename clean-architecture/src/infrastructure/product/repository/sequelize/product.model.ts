import { Model, Column, PrimaryKey, Table } from "sequelize-typescript"
import DatabaseTable from "../../../@shared/repository/tables.enum"

@Table({
    tableName: DatabaseTable.PRODUCT,
    timestamps: false,
})
export default class ProductModel extends Model {
    @PrimaryKey
    @Column
    declare id: string

    @Column({ allowNull: false })
    declare name: string

    @Column({ allowNull: false })
    declare price: number
}
