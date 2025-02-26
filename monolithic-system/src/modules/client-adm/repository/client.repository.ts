import Id from "../../@shared/domain/value-object/id.value-object"
import Client from "../domain/entity/client.entity"
import Address from "../domain/value-object/address.value-object"
import ClientGateway from "../gateway/client.gateway.interface"
import ClientModel from "./client.model"

export default class ClientRepository implements ClientGateway {
    async add(client: Client): Promise<void> {
        const dateNow = new Date()

        await ClientModel.create({
            id: client.id!.id,
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
            createdAt: dateNow,
            updatedAt: dateNow,
        })

        client.createdAt = dateNow
        client.updatedAt = dateNow
    }
    async find(id: string): Promise<Client> {
        const client = await ClientModel.findOne({
            where: { id },
        })

        if (!client) throw new Error("Client not found")

        const address = new Address({
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
        })

        return new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            document: client.document,
            address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        })
    }
}
