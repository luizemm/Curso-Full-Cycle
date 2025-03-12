import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase.interface"
import {
    PlaceOrderFacadeInputDto,
    PlaceOrderFacadeOutputDto,
} from "./checkout.facade.dto"
import CheckoutFacade from "./checkout.facade.interface"

export default class CheckoutFacadeImpl implements CheckoutFacade {
    private readonly _placeOrderUseCase: PlaceOrderUseCase

    constructor(placeOrderUseCase: PlaceOrderUseCase) {
        this._placeOrderUseCase = placeOrderUseCase
    }
    async placeOrder(
        input: PlaceOrderFacadeInputDto
    ): Promise<PlaceOrderFacadeOutputDto> {
        return await this._placeOrderUseCase.execute(input)
    }
}
