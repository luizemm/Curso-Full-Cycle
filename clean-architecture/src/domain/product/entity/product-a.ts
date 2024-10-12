import { ERROR_MESSAGES } from "../../../error/error.messages"
import ValidationError from "../../../error/validation.error"
import Product from "./product-interface"

export default class ProductA implements Product {
    private readonly _id: string
    private _name: string
    private _price: number

    constructor(id: string, name: string, price: number) {
        this._id = id
        this._name = name
        this._price = price

        this.validate()
    }

    validate() {
        if (!this._id)
            throw new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.ID)
        if (!this._name)
            throw new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.NAME)
        if (!this._price || this._price < 0)
            throw new ValidationError(
                ERROR_MESSAGES.PRICE_MUST_BE_GREATER_EQUAL_ZERO
            )
    }

    get id(): string {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get price(): number {
        return this._price
    }

    changeName(name: string) {
        this._name = name

        this.validate()
    }

    changePrice(price: number) {
        this._price = price

        this.validate()
    }
}
