import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItem from "../../domain/entity/invoice-item.entity"
import Invoice from "../../domain/entity/invoice.entity"
import Address from "../../domain/value-object/address.value-object"
import {
    GenerateInvoiceUseCaseInputDto,
    GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.usecase.dto"

export default class GenerateInvoiceUseCaseMapper {
    static toDomain(input: GenerateInvoiceUseCaseInputDto): Invoice {
        const items = input.items.map(
            item =>
                new InvoiceItem({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price,
                })
        )

        const address = new Address({
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
        })

        return new Invoice({
            name: input.name,
            document: input.document,
            address,
            items,
        })
    }

    static toOutput(invoice: Invoice): GenerateInvoiceUseCaseOutputDto {
        return {
            id: invoice.id!.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map(item => ({
                id: item.id!.id,
                name: item.name,
                price: item.price,
            })),
            total: invoice.items.reduce((total, item) => total + item.price, 0),
        }
    }
}
