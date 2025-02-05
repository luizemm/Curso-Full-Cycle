import Invoice from "../../domain/entity/invoice.entity"
import { FindInvoiceUseCaseOutputDTO } from "./find-invoice.usecase.dto"

export default class FindInvoiceUseCaseMapper {
    static toOutput(invoice: Invoice): FindInvoiceUseCaseOutputDTO {
        return {
            id: invoice.id!.id,
            name: invoice.name,
            document: invoice.document,
            address: {
                street: invoice.address.street,
                city: invoice.address.city,
                complement: invoice.address.complement,
                number: invoice.address.number,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
            },
            items: invoice.items.map(item => ({
                id: item.id!.id,
                name: item.name,
                price: item.price,
            })),
            total: invoice.items.reduce((total, item) => total + item.price, 0),
            createdAt: invoice.createdAt!,
        }
    }
}
