import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase.interface"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase.interface"
import {
    FindInvoiceFacadeInputDTO,
    FindInvoiceFacadeOutputDTO,
    GenerateInvoiceFacadeInputDto,
    GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.dto"
import InvoiceFacade from "./invoice.facade.interface"

export type UseCaseProps = {
    generateInvoiceUseCase: GenerateInvoiceUseCase
    findInvoiceUseCase: FindInvoiceUseCase
}

export default class InvoiceFacadeImpl implements InvoiceFacade {
    private readonly _generateInvoiceUseCase: GenerateInvoiceUseCase
    private readonly _findInvoiceUseCase: FindInvoiceUseCase

    constructor(props: UseCaseProps) {
        this._generateInvoiceUseCase = props.generateInvoiceUseCase
        this._findInvoiceUseCase = props.findInvoiceUseCase
    }

    async findInvoice(
        input: FindInvoiceFacadeInputDTO
    ): Promise<FindInvoiceFacadeOutputDTO> {
        return await this._findInvoiceUseCase.execute(input)
    }
    async generateInvoice(
        input: GenerateInvoiceFacadeInputDto
    ): Promise<GenerateInvoiceFacadeOutputDto> {
        return await this._generateInvoiceUseCase.execute(input)
    }
}
