export class ERROR_MESSAGES {
    static readonly CLIENT_NOT_FOUND = "Client not found"
    static readonly NO_PRODUCTS_IN_ORDER = "No products in order"
    static readonly PRODUCT_OUT_OF_STOCK = (productId: string) =>
        `Product with id ${productId} is out of stock`
    static readonly PRODUCT_NOT_FOUND = "Product not found"
}
