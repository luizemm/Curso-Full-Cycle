import { inject, injectable } from "inversify"
import { InputCreateCustomerDto } from "../../../../usecase/customer/create/create.customer.dto"
import CreateCustomerUseCase from "../../../../usecase/customer/create/create.customer.usecase"
import { HttpRequest, HttpResponse } from "../../http-interface"
import { HttpController } from "../controller-interface"
import TYPES from "../../../../infrastructure/dependency-injection/dependency.types"
import ValidationError from "../../../../error/validation.error"
import { ensureError } from "../../../../error/error.util"
import ListCustomerUseCase from "../../../../usecase/customer/list/list.customer.usecase"

@injectable()
export default class CustomerController {
    private readonly createCustomerUseCase: CreateCustomerUseCase
    private readonly listCustomerUseCase: ListCustomerUseCase

    constructor(
        @inject(TYPES.CreateCustomerUseCase)
        createCustomerUseCase: CreateCustomerUseCase,
        @inject(TYPES.ListCustomerUseCase)
        listCustomerUseCase: ListCustomerUseCase
    ) {
        this.createCustomerUseCase = createCustomerUseCase
        this.listCustomerUseCase = listCustomerUseCase
    }

    create(): HttpController {
        return async (req: HttpRequest): Promise<HttpResponse> => {
            try {
                // TODO validar entrada
                const input: InputCreateCustomerDto = {
                    name: req.body.name,
                }

                if (req.body.address) {
                    input.address = {
                        street: req.body.address.street,
                        number: req.body.address.number,
                        city: req.body.address.city,
                        zip: req.body.address.zip,
                    }
                }

                const output = await this.createCustomerUseCase.execute(input)

                return {
                    statusCode: 201,
                    body: output,
                }
            } catch (err) {
                const error = ensureError(err)

                if (error instanceof ValidationError)
                    return {
                        statusCode: 400,
                        body: {
                            timestamp: new Date(),
                            message: error.message,
                        },
                    }

                throw error
            }
        }
    }

    listAll(): HttpController {
        return async (req: HttpRequest): Promise<HttpResponse> => {
            return {
                statusCode: 200,
                body: await this.listCustomerUseCase.execute({}),
            }
        }
    }
}
