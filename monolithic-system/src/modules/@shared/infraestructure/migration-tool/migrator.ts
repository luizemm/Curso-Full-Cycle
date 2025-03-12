import { Sequelize } from "sequelize-typescript"
import { SequelizeStorage, Umzug } from "umzug"
import path from "path"

export const migrator = (sequelize: Sequelize) => {
    return new Umzug({
        migrations: {
            glob: ["migrations/*.ts", { cwd: path.join(__dirname) }],
        },
        context: sequelize,
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
    })
}
