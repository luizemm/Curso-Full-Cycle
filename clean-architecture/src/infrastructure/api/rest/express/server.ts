import express, { type Express } from "express"
import HttpServer from "../server-interface"
import { Server } from "http"
import { setRoutes } from "./routes"

export default class ExpressServer implements HttpServer {
    private readonly _app: Express

    private _server: Server | undefined

    constructor() {
        this._app = express()

        this._app.use(express.json())

        setRoutes(this._app)
    }

    async listen(port = 0): Promise<void> {
        await new Promise<void>(resolve => {
            this._server = this._app.listen(port, () => {
                console.log(`Server listening on port ${this.port}`)
                resolve()
            })
        })
    }

    async close(): Promise<void> {
        if (this._server?.listening) {
            await new Promise<void>((resolve, reject) => {
                this._server!.close(e => {
                    if (e) reject(e)
                    resolve()
                })
            })
        }
    }

    get baseUrl(): string {
        return `${this.protocol}://${this.host}:${this.port}`
    }
    get protocol(): string {
        return "http"
    }

    get host(): string {
        if (!this._server?.listening) throw new Error("Server is not listening")

        const address = this._server.address()

        if (typeof address === "string")
            return this.formatHost(
                RegExp(/^https?:\/\/([-a-zA-Z0-9%.:_+~#=]+)(?::\d+)?/).exec(
                    address
                )![1]
            )

        return this.formatHost(address!.address)
    }

    get port(): number {
        if (!this._server?.listening) throw new Error("Server is not listening")

        const address = this._server.address()

        if (typeof address === "string")
            return Number(
                RegExp(/^https?:\/\/[-a-zA-Z0-9%.:_+~#=]+(:\d+)/).exec(
                    address
                )![1]
            )

        return address!.port
    }

    private formatHost(host: string): string {
        if (host.includes(":")) return `[${host}]`

        return host
    }
}
