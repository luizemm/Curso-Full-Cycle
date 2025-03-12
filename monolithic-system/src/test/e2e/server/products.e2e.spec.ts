import { Sequelize } from "sequelize-typescript"
import request from "supertest"
import { Umzug } from "umzug"
import { dbModels } from "../../../modules/@shared/infraestructure/database/sequelize"
import { migrator } from "../../../modules/@shared/infraestructure/migration-tool/migrator"
import ProductModel from "../../../modules/product-adm/repository/product.model"
import { createApp } from "../../__test__/server"

describe("POST /products", () => {
    let sequelize: Sequelize
    let migration: Umzug<Sequelize>

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
        })
        migration = migrator(sequelize)
        sequelize.addModels(dbModels)
        await migration.up()
    })

    afterEach(async () => {
        await migration.down()
        await sequelize.close()
    })

    it("should create a product", async () => {
        const product = {
            name: "Product 1",
            description: "Product description",
            purchasePrice: 12,
            stock: 10,
        }

        await request(createApp()).post("/products").send(product).expect(204)

        const productDb = await ProductModel.findOne({
            where: { name: product.name },
        })

        expect({
            id: productDb!.id,
            name: productDb!.name,
            description: productDb!.description,
            purchasePrice: productDb!.purchasePrice,
            stock: productDb!.stock,
        }).toStrictEqual({
            id: expect.any(String),
            ...product,
        })
    })
})
