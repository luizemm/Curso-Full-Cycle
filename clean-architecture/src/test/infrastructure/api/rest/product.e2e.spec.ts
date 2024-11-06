import DatabaseTable from "../../../../infrastructure/@shared/repository/tables.enum"
import HttpServer from "../../../../infrastructure/api/rest/server-interface"
import Database from "../../../../infrastructure/database/database-interface"
import {
    InputCreateProductDto,
    OutputCreateProductDto,
} from "../../../../usecase/product/create/create.product.dto"
import { OutputListProductDto } from "../../../../usecase/product/list/list.product.dto"
import { createServer } from "../../../@config/api/rest/server.test.config"
import { createDbInstance } from "../../../@config/database/database.test.config"

describe("E2E test product", () => {
    let database: Database
    let server: HttpServer

    beforeEach(async () => {
        database = createDbInstance(Object.values(DatabaseTable))
        server = createServer()

        await database.init()
        await server.listen()
    })

    afterEach(async () => {
        await database.close()
        await server.close()
    })

    it("should create a product", async () => {
        const reqBody: InputCreateProductDto = {
            name: "Product 1",
            price: 213,
        }

        const response = await fetch(`${server.baseUrl}/product`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqBody),
        })

        const respBody = await response.json()

        expect(response.status).toBe(201)
        expect(respBody).toEqual({
            id: expect.any(String),
            name: reqBody.name,
            price: reqBody.price,
        } as OutputCreateProductDto)
    })

    it("should not create a product", async () => {
        const response = await fetch(`${server.baseUrl}/product`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        })

        // TODO voltar para status 400 depois
        // expect(response.status).toBe(400)
        expect(response.status).toBe(500)
    })

    it("should list all products", async () => {
        const reqBodies: InputCreateProductDto[] = [
            {
                name: "Product 1",
                price: 123,
            },
            {
                name: "Product 2",
                price: 242.2,
            },
        ]

        await Promise.all(
            reqBodies.map(async body => {
                const response = await fetch(`${server.baseUrl}/product`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })

                expect(response.status).toBe(201)
            })
        )

        const response = await fetch(`${server.baseUrl}/product`, {
            method: "GET",
        })

        const respBody = await response.json()

        expect(response.status).toBe(200)
        expect(respBody).toEqual({
            products: reqBodies.map(body => ({
                id: expect.any(String),
                name: body.name,
                price: body.price,
            })),
        } as OutputListProductDto)
    })
})
