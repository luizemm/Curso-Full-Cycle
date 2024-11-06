import AbstractEntity from "../../@shared/entity/entity.abstract"
import ProductType from "../enum/product-type.enum"
import ProductValidatorFactory from "../factory/product.validator.factory"
import Product from "./product-interface"

export default class ProductB extends AbstractEntity implements Product {
    public static readonly ERROR_CONTEXT = "product B"

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
        ProductValidatorFactory.create(ProductType.PRODUCT_B).validate(this)
    }

    get name(): string {
        return this._name
    }

    get price(): number {
        return this._price * 2
    }

    changeName(name: string): void {
        this._name = name

        this.validate()

        if (this.notification.hasErrors()) this.throwNotificationError()
    }

    changePrice(price: number): void {
        this._price = price

        this.validate()

        if (this.notification.hasErrors()) this.throwNotificationError()
    }
}
