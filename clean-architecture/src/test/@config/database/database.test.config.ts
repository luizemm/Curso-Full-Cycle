import DatabaseTable from "../../../infrastructure/@shared/repository/tables.enum"
import Database from "../../../infrastructure/database/database-interface"
import SequelizeDatabaseTestConfig from "./sequelize/database-sequelize.test.config"

export const createDbInstance = (useTables: DatabaseTable[]): Database =>
    new SequelizeDatabaseTestConfig(useTables)
