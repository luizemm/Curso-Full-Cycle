import InvoiceGateway from "../../gateway/invoice.gateway"
import {
    FindInvoiceUseCaseInputDTO,
    FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.usecase.dto"
import FindInvoiceUseCase from "./find-invoice.usecase.interface"
import FindInvoiceUseCaseMapper from "./find-invoice.usecase.mapper"

export default class FindInvoiceUseCaseImpl implements FindInvoiceUseCase {
    private readonly _invoiceRepository: InvoiceGateway

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository
    }

    async execute(
        input: FindInvoiceUseCaseInputDTO
    ): Promise<FindInvoiceUseCaseOutputDTO> {
        const invoice = await this._invoiceRepository.find(input.id)

        return FindInvoiceUseCaseMapper.toOutput(invoice)
    }
}
