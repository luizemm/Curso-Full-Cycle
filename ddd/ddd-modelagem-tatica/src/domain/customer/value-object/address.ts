import Address from "./address-interface"

// Value object (Objeto de valor)
export default class AddressImpl implements Address {
    private _street: string
    private _number: number
    private _zip: string
    private _city: string

    constructor(street: string, number: number, zip: string, city: string) {
        this._street = street
        this._number = number
        this._zip = zip
        this._city = city

        this.validate()
    }

    // O objeto de valor deve se validar
    validate() {
        if (!this._street) throw new Error("Street is required")
        if (this._number <= 0) throw new Error("Number must be greater than 0")
        if (this._zip.length === 0) throw new Error("Zip is required")
        if (this._city.length === 0) throw new Error("City is required")
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
