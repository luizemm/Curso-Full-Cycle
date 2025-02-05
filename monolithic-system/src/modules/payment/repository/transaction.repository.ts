import Transaction from "../domain/transaction"
import PaymentGateway from "../gateway/payment.gateway"
import TransactionModel from "./transaction.model"

export default class TransactionRepository implements PaymentGateway {
    async add(transaction: Transaction): Promise<void> {
        const createdAt = new Date()

        await TransactionModel.create({
            id: transaction.id!.id,
            orderId: transaction.orderId,
            amount: transaction.amount,
            status: transaction.status,
            createdAt: createdAt,
            updatedAt: createdAt,
        })

        transaction.createdAt = createdAt
        transaction.updatedAt = createdAt
    }
}
