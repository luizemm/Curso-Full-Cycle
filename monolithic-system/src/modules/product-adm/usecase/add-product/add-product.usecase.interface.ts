import { UseCase } from "../../../@shared/domain/usecase/usecase.interface"
import { AddProductInputDto, AddProductOutputDto } from "./add-product.dto"

export default interface AddProductUseCase
    extends UseCase<AddProductInputDto, AddProductOutputDto> {}
