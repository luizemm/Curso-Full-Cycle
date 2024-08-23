import Address from "../../../../domain/customer/value-object/address"
import Customer from "../../../../domain/customer/entity/customer"
import CustomerModel from "./customer.model"

export default class CustomerMapper {
    static toEntity(model: CustomerModel): Customer {
        const customer = new Customer(model.id, model.name)
        const address = new Address(
            model.street,
            model.number,
            model.zip,
            model.city
        )
        customer.changeAddress(address)

        customer.addRewardPoints(model.rewardPoints)
        if (model.active) customer.activate()

        return customer
    }
}
