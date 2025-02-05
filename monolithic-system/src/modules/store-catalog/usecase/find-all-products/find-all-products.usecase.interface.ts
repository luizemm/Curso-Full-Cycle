import { UseCase } from "../../../@shared/domain/usecase/usecase.interface"
import { FindAllProductsDto } from "./find-all-products.dto"

export default interface FindAllProductsUseCase
    extends UseCase<void, FindAllProductsDto> {}
