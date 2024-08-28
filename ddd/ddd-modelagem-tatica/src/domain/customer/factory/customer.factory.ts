import CustomerImpl from "../entity/customer"
import Customer from "../entity/customer-interface"
import { v4 as uuid } from "uuid"
import Address from "../value-object/address-interface"

export default class CustomerFactory {
    static create(name: string): Customer {
        return new CustomerImpl(uuid(), name)
    }
    static createWithAddress(name: string, address: Address): Customer {
        const customer = new CustomerImpl(uuid(), name)
        customer.changeAddress(address)
        return customer
    }
}
