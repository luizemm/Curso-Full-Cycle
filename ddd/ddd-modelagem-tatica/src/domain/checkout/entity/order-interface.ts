import OrderItem from "./order_item-interface"

export default interface Order {
    get id(): string
    get customerId(): string
    get items(): OrderItem[]

    total(): number
}
