import { DataTypes } from "sequelize"
import { Sequelize } from "sequelize-typescript"
import type { MigrationFn } from "umzug"

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable("products", {
        id: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        purchasePrice: {
            type: DataTypes.NUMBER,
            allowNull: true,
        },
        salesPrice: {
            type: DataTypes.NUMBER,
            allowNull: true,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    })
}

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable("products")
}
