import { ERROR_MESSAGES } from "../../../error/error.messages"
import AbstractEntity from "../../@shared/entity/entity.abstract"
import CustomerValidatorFactory from "../factory/customer.validator.factory"
import Address from "../value-object/address-interface"
import Customer from "./customer-interface"

// Entidade de NEGÓCIO
export default class CustomerImpl extends AbstractEntity implements Customer {
    public static readonly ERROR_CONTEXT = "customer"

    private _name: string
    private _address?: Address
    private _active: boolean = false
    private _rewardPoints: number = 0

    constructor(id: string, name: string) {
        super(id)
        this._name = name

        this.validate()

        if (this.notification.hasErrors()) this.throwNotificationError()
    }

    /* 
    Tem que garantir que todos os dados estejam consistentes em 
    todo o ciclo de vida da aplicação. Logo se o nome for obrigatório,
    o Customer TEM que possuir nome, esse campo não pode estar em branco
    em nenhum momento.
    */
    // constructor(id: string) {
    //     this._id = id
    // }

    validate() {
        CustomerValidatorFactory.create().validate(this)
    }

    get name(): string {
        return this._name
    }

    get address(): Address | undefined {
        return this._address
    }

    get rewardPoints(): number {
        return this._rewardPoints
    }

    /*
    Método que altera o nome do customer, que pode ou não possuir 
    regras de negócio. Mesmo se não tiver, o método tem uma intenção
    de negócio, não será somente um simples setter
    (O nome do método indica isso) 
    */
    changeName(name: string) {
        // Regras de negócio, se necessário
        this._name = name
        this.validate()
        if (this.notification.hasErrors()) this.throwNotificationError()
    }

    activate() {
        // Regras de negócio, se necessário
        if (this._address == undefined)
            this.notification.addError({
                context: CustomerImpl.ERROR_CONTEXT,
                message: ERROR_MESSAGES.ADDRESS_REQUIRED_TO_ACTIVATE_CUSTOMER,
            })

        this._active = true

        if (this.notification.hasErrors()) this.throwNotificationError()
    }

    deactivate() {
        // Regras de negócio, se necessário
        this._active = false
    }

    isActive(): boolean {
        return this._active
    }

    changeAddress(address: Address) {
        this._address = address
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points
    }
}
