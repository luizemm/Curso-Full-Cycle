import { ServerDependencies } from "../express"
import { createHandler } from "./default.handler"

export const checkoutHandler = (dependencies: ServerDependencies) =>
    createHandler(async (req, res) => {
        const { checkoutFacade } = dependencies

        const order = await checkoutFacade.placeOrder(req.body)

        order.status === "approved" ? res.status(200) : res.status(422)

        res.send(order)
    })
