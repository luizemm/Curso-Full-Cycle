import BaseEntity from "../../../@shared/domain/entity/base.entity"
import Id from "../../../@shared/domain/value-object/id.value-object"

type InvoiceItemProps = {
    id?: Id
    name: string
    price: number
    createdAt?: Date
    updatedAt?: Date
}

export default class InvoiceItem extends BaseEntity {
    private _name: string
    private _price: number

    constructor(props: InvoiceItemProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        })
        this._name = props.name
        this._price = props.price
    }

    get name() {
        return this._name
    }

    get price() {
        return this._price
    }
}
