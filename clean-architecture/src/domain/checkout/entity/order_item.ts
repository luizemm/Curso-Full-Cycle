import OrderItem from "./order_item-interface"

export default class OrderItemImpl implements OrderItem {
    private readonly _id: string
    private readonly _productId: string
    private readonly _name: string
    private readonly _price: number
    private _quantity: number

    constructor(
        id: string,
        name: string,
        price: number,
        productId: string,
        quantity: number
    ) {
        this._id = id
        this._name = name
        this._price = price
        this._productId = productId
        this._quantity = quantity

        this.validate()
    }

    validate() {
        if (!this._id) throw new Error("Id is required")
        if (!this._name) throw new Error("Name is required")
        if (!this._price || this._price < 0)
            throw new Error("Price must be greater than or equal 0")
        if (!this._productId) throw new Error("ProductId is required")
        if (!this._quantity || this._quantity <= 0)
            throw new Error("Quantity must be greater than 0")
    }

    get id(): string {
        return this._id
    }

    get productId(): string {
        return this._productId
    }

    get name(): string {
        return this._name
    }

    get price(): number {
        return this._price
    }

    get quantity(): number {
        return this._quantity
    }

    changeQuantity(quantity: number) {
        this._quantity = quantity

        this.validate()
    }

    total(): number {
        return this._price * this._quantity
    }
}
