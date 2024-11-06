import Entity from "../../@shared/entity/entity-interface"

export default interface Product extends Entity {
    get name(): string
    get price(): number

    changeName(name: string): void
    changePrice(price: number): void
}
