import Id from "../value-object/id.value-object"

export type BaseEntityProps = {
    id?: Id
    createdAt?: Date
    updatedAt?: Date
}

export default class BaseEntity {
    private readonly _id?: Id
    private _createdAt?: Date
    private _updatedAt?: Date

    constructor(props: BaseEntityProps) {
        this._id = props.id || new Id()
        this._createdAt = props.createdAt
        this._updatedAt = props.updatedAt
    }

    get id(): Id | undefined {
        return this._id
    }

    get createdAt(): Date | undefined {
        return this._createdAt
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt
    }

    set createdAt(date: Date) {
        this._createdAt = date
    }

    set updatedAt(date: Date) {
        this._updatedAt = date
    }
}
