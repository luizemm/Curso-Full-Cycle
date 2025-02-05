import { Sequelize } from "sequelize-typescript"
import TransactionModel from "../repository/transaction.model"
import { PaymentFacade } from "./payment.facade.interface"
import {
    PaymentFacadeInputDto,
    PaymentFacadeOutputDto,
} from "./payment.facade.dto"
import PaymentFacadeFactory from "../factory/payment.facade.factory"

describe("Payment Facade integration test", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([TransactionModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a transaction", async () => {
        const facade: PaymentFacade = PaymentFacadeFactory.create()

        const input: PaymentFacadeInputDto = {
            orderId: "1",
            amount: 100,
        }

        jest.useFakeTimers()

        const result = await facade.process(input)

        const createdAt = new Date()

        expect(result).toStrictEqual({
            transactionId: expect.any(String),
            orderId: input.orderId,
            amount: input.amount,
            status: "approved",
            createdAt: createdAt,
            updatedAt: createdAt,
        } as PaymentFacadeOutputDto)

        jest.useRealTimers()
    })
})
