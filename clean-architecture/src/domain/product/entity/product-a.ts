import { ERROR_MESSAGES } from "../../../error/error.messages"
import Entity from "../../@shared/entity/entity.abstract"
import Product from "./product-interface"

export default class ProductA extends Entity implements Product {
    public static readonly ERROR_CONTEXT = "product A"

    private _name: string
    private _price: number

    constructor(id: string, name: string, price: number) {
        super(id)
        this._name = name
        this._price = price

        this.validate()

        if (this.notification.hasErrors()) this.throwNotificationError()
    }

    validate() {
        if (!this._id)
            this.notification.addError({
                context: ProductA.ERROR_CONTEXT,
                message: ERROR_MESSAGES.REQUIRED_FIELD.ID,
            })
        if (!this._name)
            this.notification.addError({
                context: ProductA.ERROR_CONTEXT,
                message: ERROR_MESSAGES.REQUIRED_FIELD.NAME,
            })
        if (!this._price || this._price < 0)
            this.notification.addError({
                context: ProductA.ERROR_CONTEXT,
                message: ERROR_MESSAGES.PRICE_MUST_BE_GREATER_EQUAL_ZERO,
            })
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

        if (this.notification.hasErrors()) this.throwNotificationError()
    }

    changePrice(price: number) {
        this._price = price

        this.validate()

        if (this.notification.hasErrors()) this.throwNotificationError()
    }
}
