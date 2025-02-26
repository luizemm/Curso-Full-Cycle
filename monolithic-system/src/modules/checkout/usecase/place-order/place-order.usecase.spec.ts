import Id from "../../../@shared/domain/value-object/id.value-object"
import { FindClientFacadeOutputDto } from "../../../client-adm/facade/client-adm.facade.dto"
import ClientAdmFacade from "../../../client-adm/facade/client-adm.facade.interface"
import {
    GenerateInvoiceFacadeInputDto,
    GenerateInvoiceFacadeOutputDto,
} from "../../../invoice/facade/invoice.facade.dto"
import InvoiceFacade from "../../../invoice/facade/invoice.facade.interface"
import { PaymentFacadeOutputDto } from "../../../payment/facade/payment.facade.dto"
import { PaymentFacade } from "../../../payment/facade/payment.facade.interface"
import {
    CheckStockFacadeInputDto,
    CheckStockFacadeOutputDto,
} from "../../../product-adm/facade/product-adm.facade.dto"
import ProductAdmFacade from "../../../product-adm/facade/product-adm.facade.interface"
import { FindStoreCatalogFacadeOutputDto } from "../../../store-catalog/facade/store-catalog.facade.dto"
import StoreCatalogFacade from "../../../store-catalog/facade/store-catalog.facade.interface"
import Product from "../../domain/product.entity"
import CheckoutGateway from "../../gateway/checkout.gateway"
import { ERROR_MESSAGES } from "../../util/message/error.messages"
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto"
import PlaceOrderUseCaseImpl from "./place-order.usecase"

const clientFacadaOutput = {
    id: "1",
    name: "Client 0",
    email: "client@email.com",
    document: "document 1",
    address: {
        street: "street 1",
        number: "123",
        complement: "",
        city: "city 1",
        state: "state 1",
        zipCode: "12345-678",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
} as FindClientFacadeOutputDto

const mockClientFacade: jest.Mocked<ClientAdmFacade> = {
    find: jest.fn().mockResolvedValue(clientFacadaOutput),
    add: jest.fn(),
}

const mockProductFacade: jest.Mocked<ProductAdmFacade> = {
    addProduct: jest.fn(),
    checkStock: jest
        .fn()
        .mockImplementation(({ productId }: CheckStockFacadeInputDto) =>
            Promise.resolve({
                productId: productId,
                stock: 1,
            } as CheckStockFacadeOutputDto)
        ),
}

const findCatalogOutput = {
    id: "1",
    name: "product 1",
    description: "description 1",
    salesPrice: 35,
} as FindStoreCatalogFacadeOutputDto

const mockCatalogFacade: jest.Mocked<StoreCatalogFacade> = {
    find: jest.fn().mockResolvedValue(findCatalogOutput),
    findAll: jest.fn(),
}

const createProcessPaymentOutput = () =>
    ({
        transactionId: "1",
        orderId: "1",
        amount: 100,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
    }) as PaymentFacadeOutputDto

const mockPaymentFacade: jest.Mocked<PaymentFacade> = {
    process: jest.fn().mockResolvedValue(createProcessPaymentOutput()),
}

const mockCheckoutRepository: jest.Mocked<CheckoutGateway> = {
    addOrder: jest.fn(),
    findOrder: jest.fn(),
}

const mockInvoiceFacade: jest.Mocked<InvoiceFacade> = {
    findInvoice: jest.fn(),
    generateInvoice: jest.fn().mockImplementation(
        (input: GenerateInvoiceFacadeInputDto) =>
            ({
                id: "1",
                name: input.name,
                document: input.document,
                street: input.street,
                number: input.number,
                complement: input.complement,
                city: input.city,
                state: input.state,
                zipCode: input.zipCode,
                items: input.items,
                total: input.items.reduce((acc, item) => acc + item.price, 0),
            }) as GenerateInvoiceFacadeOutputDto
    ),
}

describe("Place Order Use Case unit test", () => {
    describe("validateProducts method", () => {
        const placeOrderUseCase = new PlaceOrderUseCaseImpl({
            clientFacade: mockClientFacade,
            productAdmFacade: mockProductFacade,
            storeCatalogFacade: mockCatalogFacade,
            paymentFacade: mockPaymentFacade,
            invoiceFacade: mockInvoiceFacade,
            checkoutRepository: mockCheckoutRepository,
        })

        it("should throw an error if no products are selected", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [],
            }

            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrow(new Error(ERROR_MESSAGES.NO_PRODUCTS_IN_ORDER))
        })

        it("should throw an error when product is out of stock", async () => {
            const productIdOutOfStock = "1"

            let input: PlaceOrderInputDto = {
                clientId: "1",
                products: [{ productId: productIdOutOfStock }],
            }

            const mpfImplementationDefault =
                mockProductFacade.checkStock.getMockImplementation()

            mockProductFacade.checkStock.mockImplementation(
                ({ productId }: CheckStockFacadeInputDto) =>
                    Promise.resolve({
                        productId: productId,
                        stock: productId === "1" ? 0 : 1,
                    } as CheckStockFacadeOutputDto)
            )

            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrow(
                new Error(
                    ERROR_MESSAGES.PRODUCT_OUT_OF_STOCK(productIdOutOfStock)
                )
            )

            input = {
                clientId: "1",
                products: [
                    { productId: "0" },
                    { productId: productIdOutOfStock },
                ],
            }

            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrow(
                new Error(
                    ERROR_MESSAGES.PRODUCT_OUT_OF_STOCK(productIdOutOfStock)
                )
            )

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)

            input = {
                clientId: "1",
                products: [
                    { productId: "0" },
                    { productId: productIdOutOfStock },
                    { productId: "2" },
                ],
            }

            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrow(
                new Error(
                    ERROR_MESSAGES.PRODUCT_OUT_OF_STOCK(productIdOutOfStock)
                )
            )

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5)

            mockProductFacade.checkStock.mockImplementation(
                mpfImplementationDefault
            )
        })
    })

    describe("getProducts method", () => {
        beforeAll(() => {
            jest.useFakeTimers()
        })

        afterAll(() => {
            jest.useRealTimers()
        })

        it("should return a product", async () => {
            const placeOrderUseCase = new PlaceOrderUseCaseImpl({
                clientFacade: mockClientFacade,
                productAdmFacade: mockProductFacade,
                storeCatalogFacade: mockCatalogFacade,
                paymentFacade: mockPaymentFacade,
                invoiceFacade: mockInvoiceFacade,
                checkoutRepository: mockCheckoutRepository,
            })

            const product = await placeOrderUseCase["getProduct"](
                findCatalogOutput.id
            )

            expect(product).toEqual(
                new Product({
                    id: new Id(findCatalogOutput.id),
                    name: findCatalogOutput.name,
                    description: findCatalogOutput.description,
                    salesPrice: findCatalogOutput.salesPrice,
                })
            )

            expect(mockCatalogFacade.find).toHaveBeenCalled()
        })

        it("should throw an error when product not found", async () => {
            const placeOrderUseCase = new PlaceOrderUseCaseImpl({
                clientFacade: mockClientFacade,
                productAdmFacade: mockProductFacade,
                storeCatalogFacade: mockCatalogFacade,
                paymentFacade: mockPaymentFacade,
                invoiceFacade: mockInvoiceFacade,
                checkoutRepository: mockCheckoutRepository,
            })

            mockCatalogFacade.find.mockRejectedValueOnce(
                new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
            )

            await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
                new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
            )

            expect(mockCatalogFacade.find).toHaveBeenCalled()
        })
    })

    describe("execute method", () => {
        it("should throw an error when client not found", async () => {
            const placeOrderUseCase = new PlaceOrderUseCaseImpl({
                clientFacade: mockClientFacade,
                productAdmFacade: mockProductFacade,
                storeCatalogFacade: mockCatalogFacade,
                paymentFacade: mockPaymentFacade,
                invoiceFacade: mockInvoiceFacade,
                checkoutRepository: mockCheckoutRepository,
            })

            mockClientFacade.find.mockRejectedValueOnce(
                new Error(ERROR_MESSAGES.CLIENT_NOT_FOUND)
            )

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [],
            }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                ERROR_MESSAGES.CLIENT_NOT_FOUND
            )
        })

        it("should throw an error when products are not valid", async () => {
            const placeOrderUseCase = new PlaceOrderUseCaseImpl({
                clientFacade: mockClientFacade,
                productAdmFacade: mockProductFacade,
                storeCatalogFacade: mockCatalogFacade,
                paymentFacade: mockPaymentFacade,
                invoiceFacade: mockInvoiceFacade,
                checkoutRepository: mockCheckoutRepository,
            })

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: [],
            }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                ERROR_MESSAGES.NO_PRODUCTS_IN_ORDER
            )
        })
    })

    describe("place an order", () => {
        it("should not be approved", async () => {
            const placeOrderUseCase = new PlaceOrderUseCaseImpl({
                clientFacade: mockClientFacade,
                productAdmFacade: mockProductFacade,
                storeCatalogFacade: mockCatalogFacade,
                paymentFacade: mockPaymentFacade,
                invoiceFacade: mockInvoiceFacade,
                checkoutRepository: mockCheckoutRepository,
            })
            const processPaymentOutput = createProcessPaymentOutput()
            processPaymentOutput.status = "declined"
            mockPaymentFacade.process.mockResolvedValueOnce(
                processPaymentOutput
            )

            const productsCatalog = [
                {
                    id: "1",
                    name: "product 1",
                    description: "description 1",
                    salesPrice: 30,
                },
                {
                    id: "2",
                    name: "product 2",
                    description: "description 2",
                    salesPrice: 40,
                },
            ] as FindStoreCatalogFacadeOutputDto[]

            productsCatalog.forEach(product =>
                mockCatalogFacade.find.mockResolvedValueOnce(product)
            )

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: productsCatalog.map(product => ({
                    productId: product.id,
                })),
            }

            const output = await placeOrderUseCase.execute(input)

            expect(output).toStrictEqual({
                id: expect.any(String),
                invoiceId: undefined,
                status: "denied",
                total: productsCatalog.reduce(
                    (acc, product) => acc + product.salesPrice,
                    0
                ),
                products: input.products,
            })
            expect(mockClientFacade.find).toHaveBeenCalled()
            expect(mockClientFacade.find).toHaveBeenCalledWith({
                id: input.clientId,
            })
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(2)
            input.products.forEach(({ productId }, i) =>
                expect(mockProductFacade.checkStock).toHaveBeenNthCalledWith(
                    i + 1,
                    { productId }
                )
            )
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(2)
            input.products.forEach(({ productId }, i) =>
                expect(mockCatalogFacade.find).toHaveBeenNthCalledWith(i + 1, {
                    id: productId,
                })
            )
            expect(mockCheckoutRepository.addOrder).toHaveBeenCalled()
            expect(mockPaymentFacade.process).toHaveBeenCalled()
            expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                orderId: output.id,
                amount: output.total,
            })
            expect(mockInvoiceFacade.generateInvoice).not.toHaveBeenCalled()
        })

        it("should be approved", async () => {
            const placeOrderUseCase = new PlaceOrderUseCaseImpl({
                clientFacade: mockClientFacade,
                productAdmFacade: mockProductFacade,
                storeCatalogFacade: mockCatalogFacade,
                paymentFacade: mockPaymentFacade,
                invoiceFacade: mockInvoiceFacade,
                checkoutRepository: mockCheckoutRepository,
            })

            const productsCatalog = [
                {
                    id: "1",
                    name: "product 1",
                    description: "description 1",
                    salesPrice: 30,
                },
                {
                    id: "2",
                    name: "product 2",
                    description: "description 2",
                    salesPrice: 40,
                },
            ] as FindStoreCatalogFacadeOutputDto[]

            productsCatalog.forEach(product =>
                mockCatalogFacade.find.mockResolvedValueOnce(product)
            )

            mockPaymentFacade.process.mockImplementationOnce(
                async ({ amount, orderId }) => ({
                    transactionId: "1",
                    orderId,
                    amount,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            )

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: productsCatalog.map(product => ({
                    productId: product.id,
                })),
            }

            const output = await placeOrderUseCase.execute(input)

            expect(output).toStrictEqual({
                id: expect.any(String),
                invoiceId: expect.any(String),
                status: "approved",
                total: productsCatalog.reduce(
                    (acc, product) => acc + product.salesPrice,
                    0
                ),
                products: input.products,
            } as PlaceOrderOutputDto)
            expect(mockClientFacade.find).toHaveBeenCalled()
            expect(mockClientFacade.find).toHaveBeenCalledWith({
                id: input.clientId,
            })
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(2)
            input.products.forEach(({ productId }, i) =>
                expect(mockProductFacade.checkStock).toHaveBeenNthCalledWith(
                    i + 1,
                    { productId }
                )
            )
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(2)
            input.products.forEach(({ productId }, i) =>
                expect(mockCatalogFacade.find).toHaveBeenNthCalledWith(i + 1, {
                    id: productId,
                })
            )
            expect(mockCheckoutRepository.addOrder).toHaveBeenCalled()
            expect(mockPaymentFacade.process).toHaveBeenCalled()
            expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                orderId: output.id,
                amount: output.total,
            })
            expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalled()
            expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledWith({
                name: clientFacadaOutput.name,
                document: clientFacadaOutput.document,
                street: clientFacadaOutput.address.street,
                number: clientFacadaOutput.address.number,
                complement: clientFacadaOutput.address.complement,
                city: clientFacadaOutput.address.city,
                state: clientFacadaOutput.address.state,
                zipCode: clientFacadaOutput.address.zipCode,
                items: productsCatalog.map(product => ({
                    id: product.id,
                    name: product.name,
                    price: product.salesPrice,
                })),
            })
        })
    })
})
