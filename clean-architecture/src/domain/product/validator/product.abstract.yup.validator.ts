import { ERROR_MESSAGES } from "../../../error/error.messages"
import { ensureError } from "../../../error/error.util"
import Validator from "../../@shared/validator/validator-interface"
import Product from "../entity/product-interface"
import * as yup from "yup"

export default abstract class ProductYupValidator<T extends Product>
    implements Validator<T>
{
    private readonly errorContext: string

    constructor(errorContext: string) {
        this.errorContext = errorContext
    }

    validate(entity: T): void {
        try {
            yup.object()
                .shape({
                    id: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD.ID),
                    name: yup
                        .string()
                        .required(ERROR_MESSAGES.REQUIRED_FIELD.NAME),
                    price: yup
                        .number()
                        .positive(
                            ERROR_MESSAGES.PRICE_MUST_BE_GREATER_EQUAL_ZERO
                        )
                        .required(
                            ERROR_MESSAGES.PRICE_MUST_BE_GREATER_EQUAL_ZERO
                        ),
                })
                .validateSync(
                    {
                        id: entity.id,
                        name: entity.name,
                        price: entity.price,
                    },
                    {
                        abortEarly: false,
                    }
                )
        } catch (err) {
            const error = ensureError(err)

            if (!(error instanceof yup.ValidationError)) throw error

            error.errors.forEach(errorMessage =>
                entity.notification.addError({
                    context: this.errorContext,
                    message: errorMessage,
                })
            )
        }
    }
}
