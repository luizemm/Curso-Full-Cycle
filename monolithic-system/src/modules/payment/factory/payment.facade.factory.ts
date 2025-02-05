import PaymentFacadeImpl from "../facade/payment.facade"
import { PaymentFacade } from "../facade/payment.facade.interface"
import TransactionRepository from "../repository/transaction.repository"
import ProcessPaymentUseCaseImpl from "../usecase/process-payment/process-payment.usecase"

export default class PaymentFacadeFactory {
    static create(): PaymentFacade {
        const transactionRepository = new TransactionRepository()
        const processPaymentUseCase = new ProcessPaymentUseCaseImpl(
            transactionRepository
        )
        return new PaymentFacadeImpl(processPaymentUseCase)
    }
}
