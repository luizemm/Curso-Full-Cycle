import Id from "../../@shared/domain/value-object/id.value-object"
import Client from "../domain/client.entity"
import ClientGateway from "../gateway/client.gateway.interface"
import ClientModel from "./client.model"

export default class ClientRepository implements ClientGateway {
    async add(client: Client): Promise<void> {
        const dateNow = new Date()

        await ClientModel.create({
            id: client.id!.id,
            name: client.name,
            email: client.email,
            address: client.address,
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

        return new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        })
    }
}
