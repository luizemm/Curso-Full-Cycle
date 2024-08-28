import Address from "../value-object/address-interface"

export default interface Customer {
    get id(): string
    get name(): string
    get address(): Address | undefined
    get rewardPoints(): number

    changeName(name: string): void
    activate(): void
    deactivate(): void
    isActive(): boolean
    changeAddress(address: Address): void
    addRewardPoints(points: number): void
}
