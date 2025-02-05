import InvoiceFacadeImpl from "../facade/invoice.facade"
import InvoiceFacade from "../facade/invoice.facade.interface"
import InvoiceGateway from "../gateway/invoice.gateway"
import InvoiceRepository from "../repository/invoice.repository"
import FindInvoiceUseCaseImpl from "../usecase/find-invoice/find-invoice.usecase"
import GenerateInvoiceUseCaseImpl from "../usecase/generate-invoice/generate-invoice.usecase"

export default class InvoiceFacadeFactory {
    static create(): InvoiceFacade {
        const invoiceRepository: InvoiceGateway = new InvoiceRepository()

        return new InvoiceFacadeImpl({
            findInvoiceUseCase: new FindInvoiceUseCaseImpl(invoiceRepository),
            generateInvoiceUseCase: new GenerateInvoiceUseCaseImpl(
                invoiceRepository
            ),
        })
    }
}
