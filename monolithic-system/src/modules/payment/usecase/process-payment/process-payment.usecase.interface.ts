import { UseCase } from "../../../@shared/domain/usecase/usecase.interface"
import {
    ProcessPaymentInputDto,
    ProcessPaymentOutputDto,
} from "./process-payment.dto"

export default interface ProcessPaymentUseCase
    extends UseCase<ProcessPaymentInputDto, ProcessPaymentOutputDto> {}
