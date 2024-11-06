import { ERROR_MESSAGES } from "../../../error/error.messages"
import { ensureError } from "../../../error/error.util"
import Validator from "../../@shared/validator/validator-interface"
import CustomerImpl from "../entity/customer"
import * as yup from "yup"

export default class CustomerYupValidator implements Validator<CustomerImpl> {
    validate(entity: CustomerImpl): void {
        try {
            yup.object()
                .shape({
                    id: yup.string().required(ERROR_MESSAGES.REQUIRED_FIELD.ID),
                    name: yup
                        .string()
                        .required(ERROR_MESSAGES.REQUIRED_FIELD.NAME),
                })
                .validateSync(
                    {
                        id: entity.id,
                        name: entity.name,
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
                    context: CustomerImpl.ERROR_CONTEXT,
                    message: errorMessage,
                })
            )
        }
    }
}
