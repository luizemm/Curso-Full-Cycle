import { UseCase } from "../../../@shared/domain/usecase/usecase.interface"
import {
    FindClientInputDto,
    FindClientOutputDto,
} from "./find-client.usecase.dto"

export default interface FindClientUseCase
    extends UseCase<FindClientInputDto, FindClientOutputDto> {}
