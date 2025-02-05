import { Sequelize } from "sequelize-typescript"
import TransactionModel from "./transaction.model"
import Transaction, { TransactionId } from "../domain/transaction"
import TransactionRepository from "./transaction.repository"

describe("Transaction repository integration test", () => {
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

    it("should add a transaction", async () => {
        const transaction = new Transaction({
            id: new TransactionId("1"),
            orderId: "1",
            amount: 100,
        })

        transaction.approve()

        const repository = new TransactionRepository()
        await repository.add(transaction)

        const transactionDb = await TransactionModel.findOne({
            where: { id: transaction.id!.id },
        })

        expect({
            id: transactionDb!.id,
            orderId: transactionDb!.orderId,
            amount: transactionDb!.amount,
            status: transactionDb!.status,
            createdAt: transactionDb!.createdAt,
            updatedAt: transactionDb!.updatedAt,
        }).toStrictEqual({
            id: transaction.id!.id,
            orderId: transaction.orderId,
            amount: transaction.amount,
            status: transaction.status,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        })
    })
})
