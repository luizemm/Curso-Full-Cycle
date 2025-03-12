import { Sequelize } from "sequelize-typescript"
import OrderModel from "./order.model"
import OrderProductsModel from "./order.items.model"
import ClientModel from "../../client-adm/repository/client.model"
import ProductModel from "../../product-adm/repository/product.model"
import Order from "../domain/order.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Client from "../domain/client.entity"
import Product from "../domain/product.entity"
import CheckoutGateway from "../gateway/checkout.gateway"
import CheckoutRepository from "./checkout.repository"

const dateNow = new Date()

const clientDb = {
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

const productsDb = [
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

describe("Checkout repository unit test", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([
            OrderModel,
            OrderProductsModel,
            ClientModel,
            ProductModel,
        ])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create an order", async () => {
        await ClientModel.create(clientDb)
        await Promise.all(
            productsDb.map(product =>
                ProductModel.create({
                    ...product,
                    salesPrice: product.purchasePrice,
                })
            )
        )

        const client = new Client({
            id: new Id(clientDb.id),
            name: clientDb.name,
            email: clientDb.email,
            address: clientDb.street,
            document: clientDb.document,
        })

        const products = productsDb.map(
            productDb =>
                new Product({
                    id: new Id(productDb.id),
                    name: productDb.name,
                    description: productDb.description,
                    salesPrice: productDb.purchasePrice,
                })
        )

        const order = new Order({
            id: new Id("1"),
            client: client,
            products: products,
            status: "pending",
        })

        const repository: CheckoutGateway = new CheckoutRepository()
        await repository.addOrder(order)

        const orderDb = await OrderModel.findOne({
            where: { id: order.id!.id },
            include: [ClientModel, ProductModel],
        })

        expect({
            id: orderDb!.id,
            client: {
                id: orderDb!.client.id,
                name: orderDb!.client.name,
                email: orderDb!.client.email,
                address: orderDb!.client.street,
                document: orderDb!.client.document,
            },
            products: orderDb!.products.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            })),
            status: orderDb!.status,
            createdAt: orderDb!.createdAt,
            updatedAt: orderDb!.updatedAt,
        }).toStrictEqual({
            id: order.id!.id,
            client: {
                id: order.client.id!.id,
                name: order.client.name,
                email: order.client.email,
                address: order.client.address,
                document: order.client.document,
            },
            products: order.products.map(product => ({
                id: product.id!.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            })),
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        })
    })

    it("should find an order by id", async () => {
        await ClientModel.create(clientDb)
        await Promise.all(
            productsDb.map(product =>
                ProductModel.create({
                    ...product,
                    salesPrice: product.purchasePrice,
                })
            )
        )

        const orderDb = {
            id: "1",
            client_id: clientDb.id,
            status: "pending",
            createdAt: dateNow,
            updatedAt: dateNow,
        }

        const orderModel = await OrderModel.create(orderDb)
        await orderModel.$add(
            "products",
            productsDb.map(product => product.id)
        )

        const repository: CheckoutGateway = new CheckoutRepository()
        const order = await repository.findOrder(orderModel.id)

        expect({
            id: order!.id!.id,
            client: {
                id: order!.client.id!.id,
                name: order!.client.name,
                email: order!.client.email,
                address: order!.client.address,
                document: order!.client.document,
            },
            products: order!.products.map(product => ({
                id: product.id!.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            })),
            status: order!.status,
            createdAt: order!.createdAt,
            updatedAt: order!.updatedAt,
        }).toStrictEqual({
            id: orderDb.id,
            client: {
                id: clientDb.id,
                name: clientDb.name,
                email: clientDb.email,
                address: clientDb.street,
                document: clientDb.document,
            },
            products: productsDb.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                salesPrice: product.purchasePrice,
            })),
            status: orderDb.status,
            createdAt: orderDb.createdAt,
            updatedAt: orderDb.updatedAt,
        })
    })
})
