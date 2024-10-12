import Customer from "../../../domain/customer/entity/customer-interface"
import { OutputUpdateCustomerDto } from "./update.customer.dto"

export default class UpdateCustomerMapper {
    static toOutput(customer: Customer): OutputUpdateCustomerDto {
        let address: OutputUpdateCustomerDto["address"]

        if (customer.address) {
            address = {
                street: customer.address.street,
                number: customer.address.number,
                zip: customer.address.zip,
                city: customer.address.city,
            }
        }

        return {
            id: customer.id,
            name: customer.name,
            address,
        }
    }
}
