export default interface OrderItem {
    get id(): string
    get productId(): string
    get name(): string
    get price(): number
    get quantity(): number

    changeQuantity(quantity: number): void
    total(): number
}
