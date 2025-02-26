import Id from "../../../@shared/domain/value-object/id.value-object"
import ClientAdmFacade from "../../../client-adm/facade/client-adm.facade.interface"
import InvoiceFacade from "../../../invoice/facade/invoice.facade.interface"
import { PaymentFacade } from "../../../payment/facade/payment.facade.interface"
import ProductAdmFacade from "../../../product-adm/facade/product-adm.facade.interface"
import StoreCatalogFacade from "../../../store-catalog/facade/store-catalog.facade.interface"
import Client from "../../domain/client.entity"
import Order from "../../domain/order.entity"
import Product from "../../domain/product.entity"
import CheckoutGateway from "../../gateway/checkout.gateway"
import { ERROR_MESSAGES } from "../../util/message/error.messages"
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto"
import PlaceOrderUseCase from "./place-order.usecase.interface"

export type UseCaseProps = {
    clientFacade: ClientAdmFacade
    productAdmFacade: ProductAdmFacade
    storeCatalogFacade: StoreCatalogFacade
    paymentFacade: PaymentFacade
    invoiceFacade: InvoiceFacade
    checkoutRepository: CheckoutGateway
}

export default class PlaceOrderUseCaseImpl implements PlaceOrderUseCase {
    private readonly _clientFacade: ClientAdmFacade
    private readonly _productAdmFacade: ProductAdmFacade
    private readonly _storeCatalogFacade: StoreCatalogFacade
    private readonly _paymentFacade: PaymentFacade
    private readonly _invoiceFacade: InvoiceFacade
    private readonly _checkoutRepository: CheckoutGateway

    constructor(props: UseCaseProps) {
        this._clientFacade = props.clientFacade
        this._productAdmFacade = props.productAdmFacade
        this._storeCatalogFacade = props.storeCatalogFacade
        this._paymentFacade = props.paymentFacade
        this._invoiceFacade = props.invoiceFacade
        this._checkoutRepository = props.checkoutRepository
    }
    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        const client = await this._clientFacade.find({
            id: input.clientId,
        })

        if (!client) throw new Error(ERROR_MESSAGES.CLIENT_NOT_FOUND)

        await this.validateProducts(input)

        const products = await Promise.all(
            input.products.map(product => this.getProduct(product.productId))
        )

        const myClient = new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            document: client.document,
            address: client.address.street,
        })

        const order = new Order({
            client: myClient,
            products,
        })

        const payment = await this._paymentFacade.process({
            orderId: order.id!.id,
            amount: order.total,
        })

        let invoice

        if (payment.status === "approved") {
            invoice = await this._invoiceFacade.generateInvoice({
                name: client.name,
                document: client.document,
                street: client.address.street,
                number: client.address.number,
                complement: client.address.complement,
                city: client.address.city,
                state: client.address.state,
                zipCode: client.address.zipCode,
                items: products.map(product => ({
                    id: product.id!.id,
                    name: product.name,
                    price: product.salesPrice,
                })),
            })

            order.approve()
        } else {
            order.deny()
        }

        this._checkoutRepository.addOrder(order)

        return {
            id: order.id!.id,
            invoiceId: invoice?.id,
            status: order.status,
            total: order.total,
            products: order.products.map(product => ({
                productId: product.id!.id,
            })),
        }
    }

    private async validateProducts(input: PlaceOrderInputDto) {
        if (input.products.length === 0)
            throw new Error(ERROR_MESSAGES.NO_PRODUCTS_IN_ORDER)

        const promiseFuncs = input.products.map(product => async () => {
            const productStock = await this._productAdmFacade.checkStock({
                productId: product.productId,
            })

            if (productStock.stock <= 0)
                throw new Error(
                    ERROR_MESSAGES.PRODUCT_OUT_OF_STOCK(productStock.productId)
                )
        })

        for (const promiseFn of promiseFuncs) {
            await promiseFn()
        }
    }

    private async getProduct(productId: string): Promise<Product> {
        const product = await this._storeCatalogFacade.find({ id: productId })

        if (!product) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)

        return new Product({
            id: new Id(product.id),
            description: product.description,
            name: product.name,
            salesPrice: product.salesPrice,
        })
    }
}
