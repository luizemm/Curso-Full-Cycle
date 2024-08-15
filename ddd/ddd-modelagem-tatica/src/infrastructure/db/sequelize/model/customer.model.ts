import { Column, Model, PrimaryKey, Table } from "sequelize-typescript"

/* 
    O domínio e o banco de dados são coisas distintas umas das outras.
    A modelagem da tabela do banco de dados deve se basear na modelagem do domínio
    e não o contrário.

    Nessa modelagem os campos de address estão na própria tabela de customer,
    mas poderia ser criado uma tabela somente para o address e depois fazer a
    relação delas
*/
@Table({
    tableName: "customer",
    timestamps: false,
})
export default class CustomerModel extends Model {
    @PrimaryKey
    @Column
    declare id: string

    @Column({ allowNull: false })
    declare name: string

    @Column({ allowNull: false })
    declare active: boolean

    @Column({ allowNull: false })
    declare rewardPoints: number

    @Column
    declare street: string

    @Column
    declare number: number

    @Column
    declare zip: string

    @Column
    declare city: string
}
