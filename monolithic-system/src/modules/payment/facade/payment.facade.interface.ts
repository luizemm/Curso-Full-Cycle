import {
    PaymentFacadeInputDto,
    PaymentFacadeOutputDto,
} from "./payment.facade.dto"

export interface PaymentFacade {
    process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto>
}
