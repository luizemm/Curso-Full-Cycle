import { UseCase } from "../../../@shared/domain/usecase/usecase.interface"
import { FindProductInputDto, FindProductOutputDto } from "./find-product.dto"

export default interface FindProductUseCase
    extends UseCase<FindProductInputDto, FindProductOutputDto> {}
