import "reflect-metadata"
import ExpressServer from "./infrastructure/api/rest/express/server"
import HttpServer from "./infrastructure/api/rest/server-interface"
import Database from "./infrastructure/database/database-interface"
import SequelizeDatabase from "./infrastructure/database/sequelize"

const startApp = async () => {
    const database: Database = new SequelizeDatabase()
    const server: HttpServer = new ExpressServer()

    await database.init()
    await server.listen(Number(process.env.PORT) || 3000)
}

startApp()
