import {
    FindInvoiceFacadeInputDTO,
    FindInvoiceFacadeOutputDTO,
    GenerateInvoiceFacadeInputDto,
    GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.dto"

export default interface InvoiceFacade {
    findInvoice(
        input: FindInvoiceFacadeInputDTO
    ): Promise<FindInvoiceFacadeOutputDTO>
    generateInvoice(
        input: GenerateInvoiceFacadeInputDto
    ): Promise<GenerateInvoiceFacadeOutputDto>
}
