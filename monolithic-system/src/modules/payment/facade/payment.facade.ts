import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase.interface"
import {
    PaymentFacadeInputDto,
    PaymentFacadeOutputDto,
} from "./payment.facade.dto"
import { PaymentFacade } from "./payment.facade.interface"

export default class PaymentFacadeImpl implements PaymentFacade {
    private readonly _processPaymentUseCase: ProcessPaymentUseCase

    constructor(processPaymentUseCase: ProcessPaymentUseCase) {
        this._processPaymentUseCase = processPaymentUseCase
    }

    async process(
        input: PaymentFacadeInputDto
    ): Promise<PaymentFacadeOutputDto> {
        return await this._processPaymentUseCase.execute(input)
    }
}
