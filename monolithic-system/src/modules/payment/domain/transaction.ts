import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface"
import BaseEntity from "../../@shared/domain/entity/base.entity"
import Id from "../../@shared/domain/value-object/id.value-object"

type TransactionProps = {
    id?: TransactionId
    amount: number
    orderId: string
    status?: string
    createdAt?: Date
    updatedAt?: Date
}

// De acordo com o DDD, é uma boa prática criar uma classe Id para cada agregado
export class TransactionId extends Id {
    constructor(id?: string) {
        super(id)
    }
}

export default class Transaction extends BaseEntity implements AggregateRoot {
    private readonly _amount: number
    private readonly _orderId: string
    private _status: string

    constructor(props: TransactionProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        })
        this._amount = props.amount
        this._orderId = props.orderId
        this._status = props.status ?? "pending"
        this.validate()
    }

    validate(): void {
        if (this._amount <= 0) {
            throw new Error("Amount must be greater than 0")
        }
    }

    approve(): void {
        this._status = "approved"
    }

    decline(): void {
        this._status = "declined"
    }

    process(): void {
        if (this._amount >= 100) this.approve()
        else this.decline()
    }

    get amount(): number {
        return this._amount
    }

    get orderId(): string {
        return this._orderId
    }

    get status(): string {
        return this._status
    }
}
