import { HttpRequest, HttpResponse } from "../http-interface"

export type HttpController = (req: HttpRequest) => Promise<HttpResponse>
