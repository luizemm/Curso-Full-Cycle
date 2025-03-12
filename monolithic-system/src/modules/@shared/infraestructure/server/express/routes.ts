import { ServerDependencies } from "./express"
import { checkoutHandler } from "./handlers/checkout.handlers"
import { createClientHandler } from "./handlers/client.handlers"
import { getInvoiceHandler } from "./handlers/invoice.handlers"
import { createProductHandler } from "./handlers/product.handlers"
import { type Express } from "express"

export const setRoutes = (app: Express, dependencies: ServerDependencies) => {
    app.post("/products", createProductHandler(dependencies))
    app.post("/clients", createClientHandler(dependencies))
    app.post("/checkout", checkoutHandler(dependencies))
    app.get("/invoice/:id", getInvoiceHandler(dependencies))
}
