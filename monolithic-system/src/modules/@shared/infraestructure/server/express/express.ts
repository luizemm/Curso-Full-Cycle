import express, { type Express } from "express"
import CheckoutFacade from "../../../../checkout/facade/checkout.facade.interface"
import ClientAdmFacade from "../../../../client-adm/facade/client-adm.facade.interface"
import InvoiceFacade from "../../../../invoice/facade/invoice.facade.interface"
import ProductAdmFacade from "../../../../product-adm/facade/product-adm.facade.interface"
import { setRoutes } from "./routes"

export type ServerDependencies = {
    productFacade: ProductAdmFacade
    clientAdmFacade: ClientAdmFacade
    checkoutFacade: CheckoutFacade
    invoiceFacade: InvoiceFacade
}
export const createServerListener = (
    dependencies: ServerDependencies
): Express => {
    const app = express()

    app.use(express.json())

    setRoutes(app, dependencies)

    return app
}
