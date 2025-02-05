import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface"
import BaseEntity from "../../@shared/domain/entity/base.entity"
import Id from "../../@shared/domain/value-object/id.value-object"

type ProductProps = {
    id: Id
    name: string
    description: string
    salesPrice: number
}

export default class Product extends BaseEntity implements AggregateRoot {
    private readonly _name: string
    private readonly _description: string
    private readonly _salesPrice: number

    constructor(props: ProductProps) {
        super({ id: props.id })
        this._name = props.name
        this._description = props.description
        this._salesPrice = props.salesPrice
    }

    get name() {
        return this._name
    }

    get description() {
        return this._description
    }

    get salesPrice() {
        return this._salesPrice
    }
}
