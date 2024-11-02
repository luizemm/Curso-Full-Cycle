import { Container } from "inversify"
import CustomerRepository from "../../../domain/customer/repository/customer-interface.repository"
import CustomerController from "../../../interfaces/http/controllers/customer/customer.controller"
import CreateCustomerUseCase from "../../../usecase/customer/create/create.customer.usecase"
import CustomerRepositoryImpl from "../../customer/repository/sequelize/customer.repository"
import TYPES from "../dependency.types"
import ListCustomerUseCase from "../../../usecase/customer/list/list.customer.usecase"
import ProductController from "../../../interfaces/http/controllers/product/product.controller"
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase"
import ProductRepositoryImpl from "../../product/repository/sequelize/product.repository"
import ProductRepository from "../../../domain/product/repository/product-interface.repository"
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase"

export default function createContainer() {
    const container = new Container()

    bindControllers(container)
    bindUseCases(container)
    bindRepositories(container)

    return container
}

function bindControllers(container: Container) {
    container
        .bind<CustomerController>(TYPES.CustomerController)
        .to(CustomerController)
    container
        .bind<ProductController>(TYPES.ProductController)
        .to(ProductController)
}

function bindUseCases(container: Container) {
    bindCustomerUseCases(container)
    bindProductUseCases(container)
}

function bindCustomerUseCases(container: Container) {
    container
        .bind<CreateCustomerUseCase>(TYPES.CreateCustomerUseCase)
        .to(CreateCustomerUseCase)
    container
        .bind<ListCustomerUseCase>(TYPES.ListCustomerUseCase)
        .to(ListCustomerUseCase)
}

function bindProductUseCases(container: Container) {
    container
        .bind<CreateProductUseCase>(TYPES.CreateProductUseCase)
        .to(CreateProductUseCase)
    container
        .bind<ListProductUseCase>(TYPES.ListProductUseCase)
        .to(ListProductUseCase)
}

function bindRepositories(container: Container) {
    container
        .bind<CustomerRepository>(TYPES.CustomerRepository)
        .to(CustomerRepositoryImpl)
    container
        .bind<ProductRepository>(TYPES.ProductRepository)
        .to(ProductRepositoryImpl)
}
