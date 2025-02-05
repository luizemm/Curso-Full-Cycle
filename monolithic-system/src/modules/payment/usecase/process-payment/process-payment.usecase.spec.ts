import Transaction from "../../domain/transaction"
import PaymentGateway from "../../gateway/payment.gateway"
import { ProcessPaymentOutputDto } from "./process-payment.dto"
import ProcessPaymentUseCaseImpl from "./process-payment.usecase"

const createMockTransactionRepository = (): jest.Mocked<PaymentGateway> => ({
    add: jest.fn().mockImplementation((transaction: Transaction) => {
        const createdAt = new Date()

        transaction.createdAt = createdAt
        transaction.updatedAt = createdAt
    }),
})

describe("Process payment use case unit test", () => {
    it("should approve a transaction", async () => {
        const transactionRepository = createMockTransactionRepository()
        const useCase = new ProcessPaymentUseCaseImpl(transactionRepository)

        const input = {
            orderId: "1",
            amount: 100,
        }

        jest.useFakeTimers()

        const result = await useCase.execute(input)

        expect(transactionRepository.add).toHaveBeenCalled()
        expect(result).toStrictEqual({
            transactionId: expect.any(String),
            orderId: "1",
            amount: 100,
            status: "approved",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as ProcessPaymentOutputDto)

        jest.useRealTimers()
    })

    it("should decline a transaction", async () => {
        const transactionRepository = createMockTransactionRepository()
        const useCase = new ProcessPaymentUseCaseImpl(transactionRepository)

        const input = {
            orderId: "1",
            amount: 99,
        }

        jest.useFakeTimers()

        const result = await useCase.execute(input)

        expect(transactionRepository.add).toHaveBeenCalled()
        expect(result).toStrictEqual({
            transactionId: expect.any(String),
            orderId: "1",
            amount: 99,
            status: "declined",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as ProcessPaymentOutputDto)

        jest.useRealTimers()
    })
})
