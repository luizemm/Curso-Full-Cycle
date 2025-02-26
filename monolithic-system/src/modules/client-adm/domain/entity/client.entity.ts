import AggregateRoot from "../../../@shared/domain/entity/aggregate-root.interface"
import BaseEntity from "../../../@shared/domain/entity/base.entity"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Address from "../value-object/address.value-object"

type ClientProps = {
    id?: Id
    name: string
    email: string
    document: string
    address: Address
    createdAt?: Date
    updatedAt?: Date
}

export default class Client extends BaseEntity implements AggregateRoot {
    private readonly _name: string
    private readonly _email: string
    private readonly _document: string
    private readonly _address: Address

    constructor(props: ClientProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        })
        this._name = props.name
        this._email = props.email
        this._document = props.document
        this._address = props.address
    }

    get name() {
        return this._name
    }

    get email() {
        return this._email
    }

    get document() {
        return this._document
    }

    get address() {
        return this._address
    }
}
