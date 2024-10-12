import DatabaseTable from "../../../infrastructure/@shared/repository/tables.enum"
import SequelizeDatabaseTestConfig from "./sequelize/database-sequelize.test.config"

export interface DatabaseTestConfig {
    init(): Promise<void>
    close(): Promise<void>
}

export const createDbInstance = (
    useTables: DatabaseTable[]
): DatabaseTestConfig => new SequelizeDatabaseTestConfig(useTables)
