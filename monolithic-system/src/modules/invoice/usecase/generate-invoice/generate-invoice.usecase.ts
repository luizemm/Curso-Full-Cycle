import InvoiceGateway from "../../gateway/invoice.gateway"
import {
    GenerateInvoiceUseCaseInputDto,
    GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.usecase.dto"
import GenerateInvoiceUseCase from "./generate-invoice.usecase.interface"
import GenerateInvoiceUseCaseMapper from "./generate-invoice.usecase.mapper"

export default class GenerateInvoiceUseCaseImpl
    implements GenerateInvoiceUseCase
{
    private readonly _invoiceRepository: InvoiceGateway

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository
    }

    async execute(
        input: GenerateInvoiceUseCaseInputDto
    ): Promise<GenerateInvoiceUseCaseOutputDto> {
        const invoice = GenerateInvoiceUseCaseMapper.toDomain(input)

        await this._invoiceRepository.add(invoice)

        return GenerateInvoiceUseCaseMapper.toOutput(invoice)
    }
}
