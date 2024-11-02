const CONTROLLER_TYPES = {
    CustomerController: Symbol.for("CustomerController"),
    ProductController: Symbol.for("ProductController"),
}

const USECASE_TYPES = {
    // Customers
    CreateCustomerUseCase: Symbol.for("CreateCustomerUseCase"),
    ListCustomerUseCase: Symbol.for("ListCustomerUseCase"),

    // Products
    CreateProductUseCase: Symbol.for("CreateProductUseCase"),
    ListProductUseCase: Symbol.for("ListProductUseCase"),
}

const REPOSITORY_TYPES = {
    CustomerRepository: Symbol.for("CustomerRepository"),
    ProductRepository: Symbol.for("ProductRepository"),
}

const TYPES = {
    ...CONTROLLER_TYPES,
    ...USECASE_TYPES,
    ...REPOSITORY_TYPES,
}

export default TYPES
