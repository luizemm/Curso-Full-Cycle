import {
    createDatabaseConn,
    dbModels,
} from "./modules/@shared/infraestructure/database/sequelize"
import { migrator } from "./modules/@shared/infraestructure/migration-tool/migrator"
import { initServer } from "./modules/@shared/infraestructure/server/server"
import CheckoutFacadeFactory from "./modules/checkout/factory/checkout.facade.factory"
import ClientAdmFacadeFactory from "./modules/client-adm/factory/client-adm.facade.factory"
import InvoiceFacadeFactory from "./modules/invoice/factory/invoice.facade.factory"
import ProductAdmFacadeFactory from "./modules/product-adm/factory/facade.factory"
import dotenv from "dotenv"

dotenv.config()

const dbConn = createDatabaseConn()
const migration = migrator(dbConn)

;(async () => {
    dbConn.addModels(dbModels)
    await migration.up()
    await dbConn.sync()

    initServer({
        productFacade: ProductAdmFacadeFactory.create(),
        clientAdmFacade: ClientAdmFacadeFactory.create(),
        checkoutFacade: CheckoutFacadeFactory.create(),
        invoiceFacade: InvoiceFacadeFactory.create(),
    })
})()
