import { inject, injectable } from "inversify"
import CustomerRepository from "../../../domain/customer/repository/customer-interface.repository"
import UseCase from "../../usecase-interface"
import {
    InputListCustomerDto,
    OutputListCustomerDto,
} from "./list.customer.dto"
import ListCustomerMapper from "./list.customer.mapper"
import TYPES from "../../../infrastructure/dependency-injection/dependency.types"

@injectable()
export default class ListCustomerUseCase
    implements UseCase<InputListCustomerDto, OutputListCustomerDto>
{
    private readonly customerRepository: CustomerRepository

    constructor(
        @inject(TYPES.CustomerRepository) customerRepository: CustomerRepository
    ) {
        this.customerRepository = customerRepository
    }

    async execute(
        _input: InputListCustomerDto
    ): Promise<OutputListCustomerDto> {
        const customers = await this.customerRepository.findAll()

        return ListCustomerMapper.toOutput(customers)
    }
}
