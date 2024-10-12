import CustomerRepository from "../../../domain/customer/repository/customer-interface.repository"
import { ERROR_MESSAGES } from "../../../error/error.messages"
import NotFoundError from "../../../error/not-found.error"
import UseCase from "../../usecase-interface"
import {
    InputFindCustomerDto,
    OutputFindCustomerDto,
} from "./find.customer.dto"
import FindCustomerMapper from "./find.customer.mapper"

export default class FindCustomerUseCase
    implements UseCase<InputFindCustomerDto, OutputFindCustomerDto>
{
    private readonly customerRepository: CustomerRepository

    constructor(customerRepository: CustomerRepository) {
        this.customerRepository = customerRepository
    }

    async execute(input: InputFindCustomerDto): Promise<OutputFindCustomerDto> {
        const customer = await this.customerRepository.find(input.id)

        if (!customer)
            throw new NotFoundError(ERROR_MESSAGES.CUSTOMER_NOT_FOUND)

        return FindCustomerMapper.toOutput(customer)
    }
}
