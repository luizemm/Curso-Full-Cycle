import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../../../../infrastructure/customer/repository/sequelize/customer.model"
import ProductModel from "../../../../../infrastructure/product/repository/sequelize/product.model"
import CustomerRepositoryImpl from "../../../../../infrastructure/customer/repository/sequelize/customer.repository"
import Customer from "../../../../../domain/customer/entity/customer"
import Address from "../../../../../domain/customer/value-object/address"
import ProductRepositoryImpl from "../../../../../infrastructure/product/repository/sequelize/product.repository"
import Product from "../../../../../domain/product/entity/product"
import OrderItem from "../../../../../domain/checkout/entity/order_item"
import Order from "../../../../../domain/checkout/entity/order"
import OrderModel from "../../../../../infrastructure/checkout/repository/sequelize/order.model"
import OrderItemModel from "../../../../../infrastructure/checkout/repository/sequelize/order_item.model"
import OrderRepositoryImpl from "../../../../../infrastructure/checkout/repository/sequelize/order.repository"

describe("Order repository test", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([
            CustomerModel,
            OrderModel,
            OrderItemModel,
            ProductModel,
        ])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create an order", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const customerId = "123"
        const customer = new Customer(customerId, "Customer 1")
        const address = new Address("Street 1", 1, "12345-678", "City 1")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productId = "1"
        const productRepository = new ProductRepositoryImpl()
        const product = new Product(productId, "product 1", 12)
        await productRepository.create(product)

        const orderRepository = new OrderRepositoryImpl()
        const orderItem1 = new OrderItem("1", "item 1", 12, productId, 1)
        const order = new Order("1", customerId, [orderItem1])

        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        expect(orderModel?.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: order.customerId,
            items: order.items.map(item => ({
                id: item.id,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                order_id: order.id,
            })),
        })
    })

    it("should insert a new order item in order", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const customerId = "123"
        const customer = new Customer(customerId, "Customer 1")
        const address = new Address("Street 1", 1, "12345-678", "City 1")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productId1 = "1"
        const productRepository = new ProductRepositoryImpl()
        const product1 = new Product(productId1, "product 1", 12)
        await productRepository.create(product1)

        const orderRepository = new OrderRepositoryImpl()
        const orderItem1 = new OrderItem("1", "item 1", 12, productId1, 1)
        const order = new Order("1", customerId, [orderItem1])

        await OrderModel.create(
            {
                id: order.id,
                customer_id: order.customerId,
                items: order.items.map(item => ({
                    id: item.id,
                    product_id: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        )

        const productId2 = "2"
        const product2 = new Product(productId2, "product 2", 15)
        await productRepository.create(product2)

        const orderItem2 = new OrderItem("2", "item 2", 15, productId2, 4)
        order.items.push(orderItem2)

        await orderRepository.update(order)

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        expect(orderModel?.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: order.customerId,
            items: order.items.map(item => ({
                id: item.id,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                order_id: order.id,
            })),
        })
    })

    it("should update an order item from an order", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const customerId = "123"
        const customer = new Customer(customerId, "Customer 1")
        const address = new Address("Street 1", 1, "12345-678", "City 1")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productId = "1"
        const productRepository = new ProductRepositoryImpl()
        const product = new Product(productId, "product 1", 12)
        await productRepository.create(product)

        const orderRepository = new OrderRepositoryImpl()
        const orderItem1 = new OrderItem("1", "item 1", 12, productId, 1)
        const order = new Order("1", customerId, [orderItem1])

        await OrderModel.create(
            {
                id: order.id,
                customer_id: order.customerId,
                items: order.items.map(item => ({
                    id: item.id,
                    product_id: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        )

        order.items.at(0)!.changeQuantity(2)

        await orderRepository.update(order)

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        expect(orderModel?.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: order.customerId,
            items: order.items.map(item => ({
                id: item.id,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                order_id: order.id,
            })),
        })
    })

    it("should remove an order item from an order", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const customerId = "123"
        const customer = new Customer(customerId, "Customer 1")
        const address = new Address("Street 1", 1, "12345-678", "City 1")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productId = "1"
        const productRepository = new ProductRepositoryImpl()
        const product = new Product(productId, "product 1", 12)
        await productRepository.create(product)

        const orderRepository = new OrderRepositoryImpl()
        const orderItem1 = new OrderItem("1", "item 1", 12, productId, 1)
        const order = new Order("1", customerId, [orderItem1])

        await OrderModel.create(
            {
                id: order.id,
                customer_id: order.customerId,
                items: order.items.map(item => ({
                    id: item.id,
                    product_id: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        )

        order.items.pop()

        await orderRepository.update(order)

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        })

        expect(orderModel?.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: order.customerId,
            items: order.items.map(item => ({
                id: item.id,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                order_id: order.id,
            })),
        })
    })

    it("should throw error when not found an order with given id on update", async () => {
        await expect(async () => {
            const customerRepository = new CustomerRepositoryImpl()
            const customerId = "123"
            const customer = new Customer(customerId, "Customer 1")
            const address = new Address("Street 1", 1, "12345-678", "City 1")
            customer.changeAddress(address)
            await customerRepository.create(customer)

            const productId = "1"
            const productRepository = new ProductRepositoryImpl()
            const product = new Product(productId, "product 1", 12)
            await productRepository.create(product)

            const orderRepository = new OrderRepositoryImpl()
            const orderItem1 = new OrderItem("1", "item 1", 12, productId, 1)
            const order = new Order("1", customerId, [orderItem1])

            await orderRepository.update(order)
        }).rejects.toThrow("Order not found with given id")
    })

    it("should find an order by id", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const customerId = "123"
        const customer = new Customer(customerId, "Customer 1")
        const address = new Address("Street 1", 1, "12345-678", "City 1")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productId = "1"
        const productRepository = new ProductRepositoryImpl()
        const product = new Product(productId, "product 1", 12)
        await productRepository.create(product)

        const orderRepository = new OrderRepositoryImpl()
        const orderItem1 = new OrderItem("1", "item 1", 12, productId, 1)
        const order = new Order("1", customerId, [orderItem1])

        const expectedOrder = {
            id: order.id,
            customer_id: order.customerId,
            items: order.items.map(item => ({
                id: item.id,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
        }

        await OrderModel.create(expectedOrder, {
            include: [{ model: OrderItemModel }],
        })

        const orderResult = await orderRepository.find(order.id)

        expect({
            id: orderResult!.id,
            customer_id: orderResult!.customerId,
            items: orderResult!.items.map(item => ({
                id: item.id,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
        }).toStrictEqual(expectedOrder)
    })

    it("should return null when not found an order by id", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const customerId = "123"
        const customer = new Customer(customerId, "Customer 1")
        const address = new Address("Street 1", 1, "12345-678", "City 1")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productId = "1"
        const productRepository = new ProductRepositoryImpl()
        const product = new Product(productId, "product 1", 12)
        await productRepository.create(product)

        const orderRepository = new OrderRepositoryImpl()
        const orderItem1 = new OrderItem("1", "item 1", 12, productId, 1)
        const order = new Order("1", customerId, [orderItem1])

        await OrderModel.create(
            {
                id: order.id,
                customer_id: order.customerId,
                items: order.items.map(item => ({
                    id: item.id,
                    product_id: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        )

        const orderResult = await orderRepository.find("2")

        expect(orderResult).toBeNull()
    })

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepositoryImpl()
        const customerId1 = "123"
        const customer1 = new Customer("123", "Customer 1")
        const address1 = new Address("Street 1", 1, "12345-678", "City 1")
        customer1.changeAddress(address1)
        await customerRepository.create(customer1)

        const productId1 = "1"
        const productRepository = new ProductRepositoryImpl()
        const product1 = new Product(productId1, "product 1", 12)
        await productRepository.create(product1)

        const orderRepository = new OrderRepositoryImpl()
        const orderItem1 = new OrderItem("1", "item 1", 12, productId1, 1)
        const order1 = new Order("1", customerId1, [orderItem1])

        const orderItem2 = new OrderItem("2", "item 2", 12, productId1, 5)
        const order2 = new Order("2", customerId1, [orderItem2])

        const expectedOrders = [order1, order2]

        const entityToModel = (order: Order) => ({
            id: order.id,
            customer_id: order.customerId,
            items: order.items.map(item => ({
                id: item.id,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
        })

        await Promise.all(
            expectedOrders.map(order =>
                OrderModel.create(entityToModel(order), {
                    include: [{ model: OrderItemModel }],
                })
            )
        )

        const ordersResult = await orderRepository.findAll()

        expect(ordersResult).toEqual(expectedOrders)
    })
})
