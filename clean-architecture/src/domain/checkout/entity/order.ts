import Order from "./order-interface"
import OrderItem from "./order_item-interface"

export default class OrderImpl implements Order {
    private readonly _id: string
    private readonly _customerId: string
    private readonly _items: OrderItem[]

    constructor(id: string, customerId: string, items: OrderItem[]) {
        this._id = id
        this._customerId = customerId
        this._items = items

        this.validate()
    }

    validate() {
        if (!this._id) throw new Error("Id is required")
        if (!this._customerId) throw new Error("CustomerId is required")
        if (!this._items || this._items.length === 0)
            throw new Error("Items are required")
    }

    get id(): string {
        return this._id
    }

    get customerId(): string {
        return this._customerId
    }

    get items(): OrderItem[] {
        return this._items
    }

    total(): number {
        return this._items.reduce((acc, item) => acc + item.total(), 0)
    }
}
