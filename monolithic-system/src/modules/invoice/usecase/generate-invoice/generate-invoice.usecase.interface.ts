import { UseCase } from "../../../@shared/domain/usecase/usecase.interface"
import {
    GenerateInvoiceUseCaseInputDto,
    GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.usecase.dto"

export default interface GenerateInvoiceUseCase
    extends UseCase<
        GenerateInvoiceUseCaseInputDto,
        GenerateInvoiceUseCaseOutputDto
    > {}
