import Validator from "../../@shared/validator/validator-interface"
import CustomerImpl from "../entity/customer"
import CustomerYupValidator from "../validator/customer.yup.validator"

export default class CustomerValidatorFactory {
    static create(): Validator<CustomerImpl> {
        return new CustomerYupValidator()
    }
}
