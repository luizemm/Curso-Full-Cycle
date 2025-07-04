import BaseEntity from "../../@shared/domain/entity/base.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Client from "./client.entity"
import Product from "./product.entity"

type OrderProps = {
    id?: Id
    client: Client
    products: Product[]
    status?: string
    createdAt?: Date
    updatedAt?: Date
}

export default class Order extends BaseEntity {
    private _client: Client
    private _products: Product[]
    private _status: string

    constructor(props: OrderProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        })
        this._client = props.client
        this._products = props.products
        this._status = props.status ?? "pending"
    }

    approve() {
        this._status = "approved"
    }

    deny() {
        this._status = "denied"
    }

    get client(): Client {
        return this._client
    }

    get products(): Product[] {
        return this._products
    }

    get status(): string {
        return this._status
    }

    get total(): number {
        return this._products.reduce(
            (total, product) => total + product.salesPrice,
            0
        )
    }
}
