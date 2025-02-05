import { UseCase } from "../../../@shared/domain/usecase/usecase.interface"
import { AddClientInputDto, AddClientOutputDto } from "./add-client.usecase.dto"

export interface AddClientUseCase
    extends UseCase<AddClientInputDto, AddClientOutputDto> {}
