import { inject, injectable } from "inversify"
import CustomerRepository from "../../../domain/customer/repository/customer-interface.repository"
import UseCase from "../../usecase-interface"
import {
    InputCreateCustomerDto,
    OutputCreateCustomerDto,
} from "./create.customer.dto"
import CreateCustomerMapper from "./create.customer.mapper"
import TYPES from "../../../infrastructure/dependency-injection/dependency.types"

@injectable()
export default class CreateCustomerUseCase
    implements UseCase<InputCreateCustomerDto, OutputCreateCustomerDto>
{
    private readonly customerRepository: CustomerRepository

    constructor(
        @inject(TYPES.CustomerRepository) customerRepository: CustomerRepository
    ) {
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
