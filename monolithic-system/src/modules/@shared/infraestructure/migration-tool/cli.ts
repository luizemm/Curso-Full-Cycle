import dotenv from "dotenv"
import { createDatabaseConn, dbModels } from "../database/sequelize"
import { migrator } from "./migrator"

dotenv.config()

const dbConn = createDatabaseConn()
dbConn.addModels(dbModels)
const migration = migrator(dbConn)

migration.runAsCLI()
