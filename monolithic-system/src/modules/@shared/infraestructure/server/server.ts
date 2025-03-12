import http from "http"
import { createServerListener, ServerDependencies } from "./express/express"

export function initServer(dependencies: ServerDependencies) {
    const port = process.env.SERVER_PORT ?? 3000

    http.createServer(createServerListener(dependencies)).listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
}
