import { RequestHandler } from "express"
import { HttpController } from "../../../../interfaces/http/controllers/controller-interface"
import {
    HttpMethod,
    HttpRequest,
} from "../../../../interfaces/http/http-interface"
import { v4 as UUID } from "uuid"
import { ensureError } from "../../../../error/error.util"
import { BaseError } from "../../../../error/base.error"

export class ExpressAdapter {
    static toController(controller: HttpController): RequestHandler {
        return async (exReq, exRes) => {
            try {
                const req: HttpRequest = {
                    url: exReq.url,
                    method: exReq.method.toUpperCase() as HttpMethod,
                    headers: exReq.headers,
                    queryParams: exReq.params,
                    body: exReq.body,
                }

                const res = await controller(req)

                if (res.headers) {
                    Object.entries(res.headers).forEach(([name, value]) => {
                        if (value) exRes.appendHeader(name, value)
                    })
                }

                exRes.status(res.statusCode).send(res.body)
            } catch (err) {
                const error = ensureError(err)

                const uuid = UUID()
                const timestamp = new Date()

                console.error({
                    id: uuid,
                    timestamp,
                    origin: exReq.ips.length > 0 ? exReq.ips : exReq.ip,
                    path: exReq.path,
                    method: exReq.method,
                    queryParams: exReq.query,
                    headers: exReq.headers,
                    body: exReq.body,
                    error: error.stack,
                    context:
                        error instanceof BaseError ? error.context : undefined,
                })

                exRes.status(500).json({
                    timestamp,
                    id: uuid,
                    message: "An unexpected error occurred",
                })
            }
        }
    }
}
