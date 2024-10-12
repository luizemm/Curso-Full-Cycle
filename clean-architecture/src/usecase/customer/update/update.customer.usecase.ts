import CustomerRepository from "../../../domain/customer/repository/customer-interface.repository"
import AddressImpl from "../../../domain/customer/value-object/address"
import { ERROR_MESSAGES } from "../../../error/error.messages"
import NotFoundError from "../../../error/not-found.error"
import UseCase from "../../usecase-interface"
import {
    InputUpdateCustomerDto,
    OutputUpdateCustomerDto,
} from "./update.customer.dto"
import UpdateCustomerMapper from "./update.customer.mapper"

export default class UpdateCustomerUseCase
    implements UseCase<InputUpdateCustomerDto, OutputUpdateCustomerDto>
{
    private readonly customerRepository: CustomerRepository

    constructor(customerRepository: CustomerRepository) {
        this.customerRepository = customerRepository
    }

    async execute(
        input: InputUpdateCustomerDto
    ): Promise<OutputUpdateCustomerDto> {
        const customer = await this.customerRepository.find(input.id)

        if (!customer)
            throw new NotFoundError(ERROR_MESSAGES.CUSTOMER_NOT_FOUND, {
                context: input.id,
            })

        customer.changeName(input.name)

        if (input.address) {
            customer.changeAddress(
                new AddressImpl(
                    input.address.street,
                    input.address.number,
                    input.address.zip,
                    input.address.city
                )
            )
        }

        await this.customerRepository.update(customer)

        return UpdateCustomerMapper.toOutput(customer)
    }
}
