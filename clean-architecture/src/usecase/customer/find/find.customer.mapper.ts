import Customer from "../../../domain/customer/entity/customer-interface"
import { OutputFindCustomerDto } from "./find.customer.dto"

export default class FindCustomerMapper {
    static toOutput(customer: Customer): OutputFindCustomerDto {
        let address: OutputFindCustomerDto["address"]

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
