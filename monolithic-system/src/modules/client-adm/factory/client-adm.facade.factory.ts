import ClientAdmFacadeImpl from "../facade/client-adm.facade"
import ClientRepository from "../repository/client.repository"
import AddClientUseCaseImpl from "../usecase/add-client/add-client.usecase"
import FindClientUseCaseImpl from "../usecase/find-client/find-client.usecase"

export default class ClientAdmFacadeFactory {
    static create() {
        const clientRepository = new ClientRepository()
        const addUsecase = new AddClientUseCaseImpl(clientRepository)
        const findUsecase = new FindClientUseCaseImpl(clientRepository)
        return new ClientAdmFacadeImpl({
            addUsecase,
            findUsecase,
        })
    }
}
