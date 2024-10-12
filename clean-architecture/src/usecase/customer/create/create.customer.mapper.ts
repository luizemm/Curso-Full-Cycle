import Customer from "../../../domain/customer/entity/customer-interface"
import CustomerFactory from "../../../domain/customer/factory/customer.factory"
import AddressImpl from "../../../domain/customer/value-object/address"
import {
    InputCreateCustomerDto,
    OutputCreateCustomerDto,
} from "./create.customer.dto"

export default class CreateCustomerMapper {
    static toEntity(input: InputCreateCustomerDto): Customer {
        if (input.address) {
            return CustomerFactory.createWithAddress(
                input.name,
                new AddressImpl(
                    input.address.street,
                    input.address.number,
                    input.address.zip,
                    input.address.city
                )
            )
        }

        return CustomerFactory.create(input.name)
    }

    static toOutput(customer: Customer): OutputCreateCustomerDto {
        let address: OutputCreateCustomerDto["address"]

        if (customer.address) {
            address = {
                street: customer.address.street,
                city: customer.address.city,
                number: customer.address.number,
                zip: customer.address.zip,
            }
        }

        return {
            id: customer.id,
            name: customer.name,
            address,
        }
    }
}
