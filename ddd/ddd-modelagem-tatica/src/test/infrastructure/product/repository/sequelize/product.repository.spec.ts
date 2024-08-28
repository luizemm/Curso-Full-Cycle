import { Sequelize } from "sequelize-typescript"
import ProductModel from "../../../../../infrastructure/product/repository/sequelize/product.model"
import ProductRepositoryImpl from "../../../../../infrastructure/product/repository/sequelize/product.repository"
import ProductA from "../../../../../domain/product/entity/product-a"
import Product from "../../../../../domain/product/entity/product-interface"

describe("Product repository test", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([ProductModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a product", async () => {
        const productRepository = new ProductRepositoryImpl()
        const product = new ProductA("1", "product 1", 20)

        await productRepository.create(product)

        const productModel = await ProductModel.findOne({ where: { id: "1" } })

        expect(productModel?.toJSON()).toStrictEqual({
            id: product.id,
            name: product.name,
            price: product.price,
        })
    })

    it("should update a product", async () => {
        const productRepository = new ProductRepositoryImpl()
        const product = new ProductA("1", "product 1", 20)

        await ProductModel.create({
            id: product.id,
            name: product.name,
            price: product.price,
        })

        product.changeName("product X")
        product.changePrice(244)

        productRepository.update(product)

        const productModel = await ProductModel.findOne({ where: { id: "1" } })

        expect(productModel?.toJSON()).toStrictEqual({
            id: product.id,
            name: product.name,
            price: product.price,
        })
    })

    it("should find a product by id", async () => {
        const productRepository = new ProductRepositoryImpl()
        const product = new ProductA("1", "product 1", 20)

        const expectedProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
        }

        await ProductModel.create(expectedProduct)

        const productResult = await productRepository.find("1")

        expect({
            id: productResult!.id,
            name: productResult!.name,
            price: productResult!.price,
        }).toStrictEqual(expectedProduct)
    })

    it("should return null when not found product by id", async () => {
        const productRepository = new ProductRepositoryImpl()
        const product = new ProductA("1", "product 1", 20)

        const expectedProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
        }

        await ProductModel.create(expectedProduct)

        expect(await productRepository.find("2")).toBeNull()
    })

    it("should find all products", async () => {
        const productRepository = new ProductRepositoryImpl()
        const product1 = new ProductA("1", "product 1", 20)
        const product2 = new ProductA("2", "product 2", 26)

        const entityToModel = (product: Product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
        })

        const expectedProducts = [product1, product2]

        await Promise.all(
            expectedProducts.map(product =>
                ProductModel.create(entityToModel(product))
            )
        )

        const productsResult = await productRepository.findAll()

        expect(productsResult).toEqual(expectedProducts)
    })
})
