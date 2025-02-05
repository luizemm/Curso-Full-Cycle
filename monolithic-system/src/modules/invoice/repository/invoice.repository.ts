import Id from "../../@shared/domain/value-object/id.value-object"
import InvoiceItem from "../domain/entity/invoice-item.entity"
import Invoice from "../domain/entity/invoice.entity"
import Address from "../domain/value-object/address.value-object"
import InvoiceGateway from "../gateway/invoice.gateway"
import { ERROR_MESSAGES } from "../util/message/error.messages"
import InvoiceItemModel from "./invoice-item.model"
import InvoiceModel from "./invoice.model"

export default class InvoiceRepository implements InvoiceGateway {
    async add(invoice: Invoice): Promise<void> {
        const dateNow = new Date()

        await InvoiceModel.create(
            {
                id: invoice.id!.id,
                name: invoice.name,
                document: invoice.document,
                street: invoice.address.street,
                city: invoice.address.city,
                complement: invoice.address.complement,
                number: invoice.address.number,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
                items: invoice.items.map(item => ({
                    id: item.id!.id,
                    name: item.name,
                    price: item.price,
                    invoice_id: invoice.id!.id,
                    createdAt: dateNow,
                    updatedAt: dateNow,
                })),
                createdAt: dateNow,
                updatedAt: dateNow,
            },
            {
                include: InvoiceItemModel,
            }
        )

        invoice.createdAt = dateNow
        invoice.updatedAt = dateNow

        invoice.items.forEach(item => {
            item.createdAt = dateNow
            item.updatedAt = dateNow
        })
    }
    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: { id },
            include: InvoiceItemModel,
        })

        if (!invoice) throw new Error(ERROR_MESSAGES.INVOICE_NOT_FOUND)

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            address: new Address({
                street: invoice.street,
                number: invoice.number,
                complement: invoice.complement,
                city: invoice.city,
                state: invoice.state,
                zipCode: invoice.zipCode,
            }),
            document: invoice.document,
            items: invoice.items.map(
                item =>
                    new InvoiceItem({
                        id: new Id(item.id),
                        name: item.name,
                        price: item.price,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                    })
            ),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        })
    }
}
