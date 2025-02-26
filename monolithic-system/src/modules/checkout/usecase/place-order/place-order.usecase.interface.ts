import { UseCase } from "../../../@shared/domain/usecase/usecase.interface"
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto"

export default interface PlaceOrderUseCase
    extends UseCase<PlaceOrderInputDto, PlaceOrderOutputDto> {}
