import { UseCase } from "../../../@shared/domain/usecase/usecase.interface"
import {
    GetProductStockInputDto,
    GetProductStockOutputDto,
} from "./get-product-stock.dto"

export default interface GetProductStockUseCase
    extends UseCase<GetProductStockInputDto, GetProductStockOutputDto> {}
