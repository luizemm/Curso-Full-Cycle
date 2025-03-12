import { Sequelize } from "sequelize-typescript"
import { dbModels } from "../../@shared/infraestructure/database/sequelize"
import ClientModel from "../../client-adm/repository/client.model"
import ProductModel from "../../product-adm/repository/product.model"
import CheckoutFacadeFactory from "../factory/checkout.facade.factory"
import {
    PlaceOrderFacadeInputDto,
    PlaceOrderFacadeOutputDto,
} from "./checkout.facade.dto"
import { Umzug } from "umzug"
import { migrator } from "../../@shared/infraestructure/migration-tool/migrator"

describe("Checkout Facade integration test", () => {
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
        const facade = CheckoutFacadeFactory.create()

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

        const input: PlaceOrderFacadeInputDto = {
            clientId: client.id,
            products: products.map(product => ({ productId: product.id })),
        }

        const output = await facade.placeOrder(input)

        expect(output).toStrictEqual({
            id: expect.any(String),
            invoiceId: expect.any(String),
            status: "approved",
            total: products.reduce(
                (acc, product) => acc + product.purchasePrice,
                0
            ),
            products: input.products,
        } as PlaceOrderFacadeOutputDto)
    })

    it("should place an order and it should be denied", async () => {
        const facade = CheckoutFacadeFactory.create()

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

        const input: PlaceOrderFacadeInputDto = {
            clientId: client.id,
            products: products.map(product => ({ productId: product.id })),
        }

        const output = await facade.placeOrder(input)

        expect(output).toStrictEqual({
            id: expect.any(String),
            invoiceId: undefined,
            status: "denied",
            total: products.reduce(
                (acc, product) => acc + product.purchasePrice,
                0
            ),
            products: input.products,
        } as PlaceOrderFacadeOutputDto)
    })
})
