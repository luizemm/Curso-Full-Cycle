import { ServerDependencies } from "../express"
import { createHandler } from "./default.handler"

export const createClientHandler = (dependencies: ServerDependencies) =>
    createHandler(async (req, res) => {
        const { clientAdmFacade } = dependencies

        await clientAdmFacade.add(req.body)

        res.status(204).end()
    })
