import { UseCase } from "../../../@shared/domain/usecase/usecase.interface"
import {
    FindInvoiceUseCaseInputDTO,
    FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.usecase.dto"

export default interface FindInvoiceUseCase
    extends UseCase<FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO> {}
