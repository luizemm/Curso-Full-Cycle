import CustomerRepository from "../../../domain/customer/repository/customer-interface.repository"
import UseCase from "../../usecase-interface"
import {
    InputCreateCustomerDto,
    OutputCreateCustomerDto,
} from "./create.customer.dto"
import CreateCustomerMapper from "./create.customer.mapper"

export default class CreateCustomerUseCase
    implements UseCase<InputCreateCustomerDto, OutputCreateCustomerDto>
{
    private readonly customerRepository: CustomerRepository

    constructor(customerRepository: CustomerRepository) {
        this.customerRepository = customerRepository
    }

    async execute(
        input: InputCreateCustomerDto
    ): Promise<OutputCreateCustomerDto> {
        const customer = CreateCustomerMapper.toEntity(input)

        await this.customerRepository.create(customer)

        return CreateCustomerMapper.toOutput(customer)
    }
}
