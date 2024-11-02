import { injectable } from "inversify"
import Customer from "../../../../domain/customer/entity/customer-interface"
import CustomerRepository from "../../../../domain/customer/repository/customer-interface.repository"
import CustomerMapper from "./customer.mapper"
import CustomerModel from "./customer.model"

@injectable()
export default class CustomerRepositoryImpl implements CustomerRepository {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address?.street,
            number: entity.address?.number,
            zip: entity.address?.zip,
            city: entity.address?.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        })
    }
    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.name,
                street: entity.address?.street,
                number: entity.address?.number,
                zip: entity.address?.zip,
                city: entity.address?.city,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints,
            },
            { where: { id: entity.id } }
        )
    }
    async find(id: string): Promise<Customer | null> {
        const customerModel = await CustomerModel.findOne({ where: { id } })

        if (!customerModel) return null

        return CustomerMapper.toEntity(customerModel)
    }
    async findAll(): Promise<Customer[]> {
        const customerModelList = await CustomerModel.findAll()

        return customerModelList.map(customerModel =>
            CustomerMapper.toEntity(customerModel)
        )
    }
}
