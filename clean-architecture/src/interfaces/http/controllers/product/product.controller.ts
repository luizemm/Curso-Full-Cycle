import { inject, injectable } from "inversify"
import TYPES from "../../../../infrastructure/dependency-injection/dependency.types"
import CreateProductUseCase from "../../../../usecase/product/create/create.product.usecase"
import { HttpController } from "../controller-interface"
import { HttpRequest, HttpResponse } from "../../http-interface"
import { InputCreateProductDto } from "../../../../usecase/product/create/create.product.dto"
import { ensureError } from "../../../../error/error.util"
import ValidationError from "../../../../error/validation.error"
import ListProductUseCase from "../../../../usecase/product/list/list.product.usecase"
import NotificationError from "../../../../domain/@shared/notification/notification.error"

@injectable()
export default class ProductController {
    private readonly createProductUseCase: CreateProductUseCase
    private readonly listProductUseCase: ListProductUseCase

    constructor(
        @inject(TYPES.CreateProductUseCase)
        createProductUseCase: CreateProductUseCase,
        @inject(TYPES.ListProductUseCase)
        listProductUseCase: ListProductUseCase
    ) {
        this.createProductUseCase = createProductUseCase
        this.listProductUseCase = listProductUseCase
    }

    create(): HttpController {
        return async (req: HttpRequest): Promise<HttpResponse> => {
            try {
                // TODO validar entrada
                const input: InputCreateProductDto = {
                    name: req.body.name,
                    price: req.body.price,
                }

                const output = await this.createProductUseCase.execute(input)

                return {
                    statusCode: 201,
                    body: output,
                }
            } catch (err) {
                const error = ensureError(err)

                if (
                    error instanceof ValidationError ||
                    error instanceof NotificationError
                )
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
                body: await this.listProductUseCase.execute({}),
            }
        }
    }
}
