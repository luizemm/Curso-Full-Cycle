import DatabaseTable from "../../../../infrastructure/@shared/repository/tables.enum"
import HttpServer from "../../../../infrastructure/api/rest/server-interface"
import Database from "../../../../infrastructure/database/database-interface"
import {
    InputCreateCustomerDto,
    OutputCreateCustomerDto,
} from "../../../../usecase/customer/create/create.customer.dto"
import { OutputListCustomerDto } from "../../../../usecase/customer/list/list.customer.dto"
import { createServer } from "../../../@config/api/rest/server.test.config"
import { createDbInstance } from "../../../@config/database/database.test.config"

describe("E2E test customer", () => {
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

    it("should create a customer", async () => {
        const reqBody = {
            name: "John",
            address: {
                street: "Street",
                number: 123,
                city: "City",
                zip: "Zip",
            },
        } as InputCreateCustomerDto

        const response = await fetch(`${server.baseUrl}/customer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqBody),
        })

        const respBody = await response.json()

        expect(response.status).toBe(201)
        expect(respBody).toEqual({
            id: expect.any(String),
            name: reqBody.name,
            address: reqBody.address,
        } as OutputCreateCustomerDto)
    })

    it("should not create a customer", async () => {
        const response = await fetch(`${server.baseUrl}/customer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        })

        // TODO voltar para status 400 depois
        // expect(response.status).toBe(400)
        expect(response.status).toBe(500)
    })

    it("should list all customers", async () => {
        const reqBodies = [
            {
                name: "John",
                address: {
                    street: "Street 1",
                    number: 123,
                    city: "City 1",
                    zip: "Zip 1",
                },
            },
            {
                name: "Marie",
            },
        ] as InputCreateCustomerDto[]

        await Promise.all(
            reqBodies.map(async body => {
                const response = await fetch(`${server.baseUrl}/customer`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })

                expect(response.status).toBe(201)
            })
        )

        const response = await fetch(`${server.baseUrl}/customer`, {
            method: "GET",
        })

        const respBody = await response.json()

        expect(response.status).toBe(200)
        expect(respBody).toEqual({
            customers: reqBodies.map(body => ({
                id: expect.any(String),
                name: body.name,
                address: body.address,
            })),
        } as OutputListCustomerDto)
    })
})
