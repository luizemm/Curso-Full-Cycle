import { ServerDependencies } from "../express"
import { createHandler } from "./default.handler"

export const createProductHandler = (dependencies: ServerDependencies) =>
    createHandler(async (req, res) => {
        const { productFacade } = dependencies

        await productFacade.addProduct(req.body)

        res.status(204).end()
    })
