import { createServerListener } from "../../modules/@shared/infraestructure/server/express/express"
import CheckoutFacadeFactory from "../../modules/checkout/factory/checkout.facade.factory"
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm.facade.factory"
import InvoiceFacadeFactory from "../../modules/invoice/factory/invoice.facade.factory"
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory"

export const createApp = () =>
    createServerListener({
        productFacade: ProductAdmFacadeFactory.create(),
        clientAdmFacade: ClientAdmFacadeFactory.create(),
        checkoutFacade: CheckoutFacadeFactory.create(),
        invoiceFacade: InvoiceFacadeFactory.create(),
    })
