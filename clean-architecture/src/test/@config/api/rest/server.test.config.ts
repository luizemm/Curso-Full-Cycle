import ExpressServer from "../../../../infrastructure/api/rest/express/server"
import HttpServer from "../../../../infrastructure/api/rest/server-interface"

export const createServer = (): HttpServer => new ExpressServer()
