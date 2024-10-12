import CustomerRepository from "../../../domain/customer/repository/customer-interface.repository"
import UseCase from "../../usecase-interface"
import {
    InputListCustomerDto,
    OutputListCustomerDto,
} from "./list.customer.dto"
import ListCustomerMapper from "./list.customer.mapper"

export default class ListCustomerUseCase
    implements UseCase<InputListCustomerDto, OutputListCustomerDto>
{
    private readonly customerRepository: CustomerRepository

    constructor(customerRepository: CustomerRepository) {
        this.customerRepository = customerRepository
    }

    async execute(
        _input: InputListCustomerDto
    ): Promise<OutputListCustomerDto> {
        const customers = await this.customerRepository.findAll()

        return ListCustomerMapper.toOutput(customers)
    }
}
