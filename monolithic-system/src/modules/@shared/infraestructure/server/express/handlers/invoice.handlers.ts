import { ERROR_MESSAGES } from "../../../../../invoice/util/message/error.messages"
import { ServerDependencies } from "../express"
import { createHandler } from "./default.handler"

export const getInvoiceHandler = (dependencies: ServerDependencies) =>
    createHandler(async (req, res) => {
        const { invoiceFacade } = dependencies

        try {
            const invoice = await invoiceFacade.findInvoice({
                id: req.params.id,
            })
            res.status(200).send(invoice)
        } catch (err) {
            if (
                err instanceof Error &&
                err.message === ERROR_MESSAGES.INVOICE_NOT_FOUND
            ) {
                res.status(404).send({
                    error: ERROR_MESSAGES.INVOICE_NOT_FOUND,
                })
                return
            }

            throw err
        }
    })
