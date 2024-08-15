import Address from "../../../../domain/entity/address"
import Customer from "../../../../domain/entity/customer"
import CustomerModel from "../model/customer.model"

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
