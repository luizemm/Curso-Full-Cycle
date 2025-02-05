import Transaction from "../../domain/transaction"
import PaymentGateway from "../../gateway/payment.gateway"
import {
    ProcessPaymentInputDto,
    ProcessPaymentOutputDto,
} from "./process-payment.dto"
import ProcessPaymentUseCase from "./process-payment.usecase.interface"

export default class ProcessPaymentUseCaseImpl
    implements ProcessPaymentUseCase
{
    private readonly _transactionRepository: PaymentGateway

    constructor(transactionRepository: PaymentGateway) {
        this._transactionRepository = transactionRepository
    }

    async execute(
        input: ProcessPaymentInputDto
    ): Promise<ProcessPaymentOutputDto> {
        const transaction = new Transaction({
            orderId: input.orderId,
            amount: input.amount,
        })

        transaction.process()

        await this._transactionRepository.add(transaction)

        return {
            transactionId: transaction.id!.id,
            orderId: transaction.orderId,
            amount: transaction.amount,
            status: transaction.status,
            createdAt: transaction.createdAt!,
            updatedAt: transaction.updatedAt!,
        }
    }
}
