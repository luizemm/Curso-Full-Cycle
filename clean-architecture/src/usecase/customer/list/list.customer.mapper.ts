import Customer from "../../../domain/customer/entity/customer-interface"
import { OutputListCustomerDto } from "./list.customer.dto"

export default class ListCustomerMapper {
    static toOutput(customers: Customer[]): OutputListCustomerDto {
        return {
            customers: customers.map(({ id, name, address }) => ({
                id,
                name,
                address: address
                    ? {
                          street: address.street,
                          number: address.number,
                          zip: address.zip,
                          city: address.city,
                      }
                    : undefined,
            })),
        }
    }
}
