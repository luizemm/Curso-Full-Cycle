import Transaction from "../domain/transaction"

export default interface PaymentGateway {
    add(transaction: Transaction): Promise<void>
}
