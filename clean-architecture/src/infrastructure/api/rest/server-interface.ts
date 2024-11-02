export default interface HttpServer {
    listen(port?: number): Promise<void>
    close(): Promise<void>

    get baseUrl(): string
    get protocol(): string
    get host(): string
    get port(): number
}
