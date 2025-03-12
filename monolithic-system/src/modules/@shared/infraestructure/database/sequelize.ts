import { Sequelize } from "sequelize-typescript"
import ProductModel from "../../../product-adm/repository/product.model"
import { default as ProductStoreCatalog } from "../../../store-catalog/repository/product.model"
import ClientModel from "../../../client-adm/repository/client.model"
import InvoiceModel from "../../../invoice/repository/invoice.model"
import InvoiceItemModel from "../../../invoice/repository/invoice-item.model"
import TransactionModel from "../../../payment/repository/transaction.model"
import OrderModel from "../../../checkout/repository/order.model"
import OrderProductsModel from "../../../checkout/repository/order.items.model"

export const dbModels = [
    ProductModel,
    ProductStoreCatalog,
    ClientModel,
    InvoiceModel,
    InvoiceItemModel,
    TransactionModel,
    OrderModel,
    OrderProductsModel,
]
export const createDatabaseConn = () =>
    new Sequelize({
        dialect: "sqlite",
        storage: "./tmp/database.sqlite",
        logging: true,
    })
