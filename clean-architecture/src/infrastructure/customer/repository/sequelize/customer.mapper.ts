import AddressImpl from "../../../../domain/customer/value-object/address"
import CustomerImpl from "../../../../domain/customer/entity/customer"
import CustomerModel from "./customer.model"
import Customer from "../../../../domain/customer/entity/customer-interface"
import Address from "../../../../domain/customer/value-object/address-interface"

export default class CustomerMapper {
    static toEntity(model: CustomerModel): Customer {
        const customer = new CustomerImpl(model.id, model.name)
        let address: Address

        if (model.street) {
            address = new AddressImpl(
                model.street,
                model.number,
                model.zip,
                model.city
            )

            customer.changeAddress(address)
        }

        customer.addRewardPoints(model.rewardPoints)
        if (model.active) customer.activate()

        return customer
    }
}
