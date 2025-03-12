import { Sequelize } from "sequelize-typescript"
import request from "supertest"
import { Umzug } from "umzug"
import { dbModels } from "../../../modules/@shared/infraestructure/database/sequelize"
import { migrator } from "../../../modules/@shared/infraestructure/migration-tool/migrator"
import ClientModel from "../../../modules/client-adm/repository/client.model"
import ProductModel from "../../../modules/product-adm/repository/product.model"
import { createApp } from "../../__test__/server"

describe("POST /checkout", () => {
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
        await sequelize.sync()
    })

    afterEach(async () => {
        await migration.down()
        await sequelize.close()
    })

    it("should place an order and it should be approved", async () => {
        const dateNow = new Date()

        const client = {
            id: "1",
            name: "Client 1",
            email: "client1@email.com",
            document: "document",
            street: "Street 1",
            number: "100",
            complement: "Apt 101",
            city: "City 1",
            state: "State 1",
            zipCode: "12345-678",
            createdAt: dateNow,
            updatedAt: dateNow,
        }

        await ClientModel.create(client)

        const products = [
            {
                id: "1",
                name: "Product 1",
                description: "Description",
                purchasePrice: 80,
                stock: 10,
                createdAt: dateNow,
                updatedAt: dateNow,
            },
            {
                id: "2",
                name: "Product 2",
                description: "Description",
                purchasePrice: 20,
                stock: 15,
                createdAt: dateNow,
                updatedAt: dateNow,
            },
        ]

        await Promise.all(
            products.map(product =>
                ProductModel.create({
                    ...product,
                    salesPrice: product.purchasePrice,
                })
            )
        )

        const input = {
            clientId: client.id,
            products: products.map(product => ({ productId: product.id })),
        }

        const res = await request(createApp())
            .post("/checkout")
            .send(input)
            .expect(200)

        expect(res.body).toStrictEqual({
            id: expect.any(String),
            invoiceId: expect.any(String),
            status: "approved",
            total: products.reduce(
                (sum, product) => sum + product.purchasePrice,
                0
            ),
            products: input.products,
        })
    })

    it("should place an order and it should be denied", async () => {
        const dateNow = new Date()

        const client = {
            id: "1",
            name: "Client 1",
            email: "client1@email.com",
            document: "document",
            street: "Street 1",
            number: "100",
            complement: "Apt 101",
            city: "City 1",
            state: "State 1",
            zipCode: "12345-678",
            createdAt: dateNow,
            updatedAt: dateNow,
        }

        await ClientModel.create(client)

        const products = [
            {
                id: "1",
                name: "Product 1",
                description: "Description",
                purchasePrice: 10,
                stock: 10,
                createdAt: dateNow,
                updatedAt: dateNow,
            },
            {
                id: "2",
                name: "Product 2",
                description: "Description",
                purchasePrice: 20,
                stock: 15,
                createdAt: dateNow,
                updatedAt: dateNow,
            },
        ]

        await Promise.all(
            products.map(product =>
                ProductModel.create({
                    ...product,
                    salesPrice: product.purchasePrice,
                })
            )
        )

        const input = {
            clientId: client.id,
            products: products.map(product => ({ productId: product.id })),
        }

        const res = await request(createApp())
            .post("/checkout")
            .send(input)
            .expect(422)

        expect(res.body).toStrictEqual({
            id: expect.any(String),
            status: "denied",
            total: products.reduce(
                (sum, product) => sum + product.purchasePrice,
                0
            ),
            products: input.products,
        })
    })
})
