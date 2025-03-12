import { Request, Response } from "express"

export const createHandler =
    (controllerFn: (req: Request, res: Response) => Promise<void>) =>
    async (req: Request, res: Response) => {
        try {
            await controllerFn(req, res)
        } catch (error) {
            console.error(error)
            res.status(500).send({
                timestamp: new Date(),
                error: "unexpected error",
            })
        }
    }
