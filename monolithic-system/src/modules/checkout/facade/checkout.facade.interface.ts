import {
    PlaceOrderFacadeInputDto,
    PlaceOrderFacadeOutputDto,
} from "./checkout.facade.dto"

export default interface CheckoutFacade {
    placeOrder(
        input: PlaceOrderFacadeInputDto
    ): Promise<PlaceOrderFacadeOutputDto>
}
