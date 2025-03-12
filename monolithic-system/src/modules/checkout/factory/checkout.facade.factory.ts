import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory"
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory"
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory"
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory"
import StoreCatalogFacadeFactory from "../../store-catalog/factory/store-catalog.facade.factory"
import CheckoutFacadeImpl from "../facade/checkout.facade"
import CheckoutFacade from "../facade/checkout.facade.interface"
import CheckoutRepository from "../repository/checkout.repository"
import PlaceOrderUseCaseImpl from "../usecase/place-order/place-order.usecase"

export default class CheckoutFacadeFactory {
    static create(): CheckoutFacade {
        const placeOrderUseCase = new PlaceOrderUseCaseImpl({
            checkoutRepository: new CheckoutRepository(),
            clientFacade: ClientAdmFacadeFactory.create(),
            productAdmFacade: ProductAdmFacadeFactory.create(),
            invoiceFacade: InvoiceFacadeFactory.create(),
            paymentFacade: PaymentFacadeFactory.create(),
            storeCatalogFacade: StoreCatalogFacadeFactory.create(),
        })

        return new CheckoutFacadeImpl(placeOrderUseCase)
    }
}
