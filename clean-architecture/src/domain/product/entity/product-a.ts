import AbstractEntity from "../../@shared/entity/entity.abstract"
import ProductType from "../enum/product-type.enum"
import ProductValidatorFactory from "../factory/product.validator.factory"
import Product from "./product-interface"

export default class ProductA extends AbstractEntity implements Product {
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
        ProductValidatorFactory.create(ProductType.PRODUCT_A).validate(this)
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
