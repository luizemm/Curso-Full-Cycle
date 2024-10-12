import { ERROR_MESSAGES } from "../../../error/error.messages"
import ValidationError from "../../../error/validation.error"
import Address from "./address-interface"

// Value object (Objeto de valor)
export default class AddressImpl implements Address {
    private readonly _street: string
    private readonly _number: number
    private readonly _zip: string
    private readonly _city: string

    constructor(street: string, number: number, zip: string, city: string) {
        this._street = street
        this._number = number
        this._zip = zip
        this._city = city

        this.validate()
    }

    // O objeto de valor deve se validar
    validate() {
        if (!this._street)
            throw new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.STREET, {
                context: this._street,
            })
        if (this._number <= 0)
            throw new ValidationError(
                ERROR_MESSAGES.NUMBER_MUST_BE_GREATER_ZERO,
                {
                    context: this._number,
                }
            )
        if (this._zip.length === 0)
            throw new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.ZIP, {
                context: this._zip,
            })
        if (this._city.length === 0)
            throw new ValidationError(ERROR_MESSAGES.REQUIRED_FIELD.CITY, {
                context: this.city,
            })
    }

    get street(): string {
        return this._street
    }

    get number(): number {
        return this._number
    }

    get zip(): string {
        return this._zip
    }

    get city(): string {
        return this._city
    }

    // Objeto de valor é imutável, não pode ser editado, logo não pode possuir setters.

    //Podem existir diversas formas de retornar os dados do objeto de valor.
    toString() {
        return `${this._street} ${this._number}, ${this._city}. Zip: ${this._zip}`
    }
}
