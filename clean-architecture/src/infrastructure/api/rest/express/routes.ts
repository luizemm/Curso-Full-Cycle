import { type Express } from "express"
import dependencyProvider from "../../../dependency-injection/dependency.provider"
import TYPES from "../../../dependency-injection/dependency.types"
import { ExpressAdapter } from "./controller.adapter"
import CustomerController from "../../../../interfaces/http/controllers/customer/customer.controller"
import ProductController from "../../../../interfaces/http/controllers/product/product.controller"

export function setRoutes(app: Express) {
    app.post(
        "/customer",
        ExpressAdapter.toController(
            dependencyProvider
                .get<CustomerController>(TYPES.CustomerController)
                .create()
        )
    )

    app.get(
        "/customer",
        ExpressAdapter.toController(
            dependencyProvider
                .get<CustomerController>(TYPES.CustomerController)
                .listAll()
        )
    )

    app.post(
        "/product",
        ExpressAdapter.toController(
            dependencyProvider
                .get<ProductController>(TYPES.ProductController)
                .create()
        )
    )

    app.get(
        "/product",
        ExpressAdapter.toController(
            dependencyProvider
                .get<ProductController>(TYPES.ProductController)
                .listAll()
        )
    )
}
