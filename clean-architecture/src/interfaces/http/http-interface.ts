export type HttpMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "PATCH"
    | "OPTIONS"
    | "HEAD"

export type HttpHeaders = Record<string, string | string[] | undefined>

export interface HttpRequest {
    method: HttpMethod
    url: string
    headers?: HttpHeaders
    body?: any
    queryParams?: Record<string, string | number>
}

export interface HttpResponse {
    statusCode: number
    headers?: HttpHeaders
    body?: any
}
