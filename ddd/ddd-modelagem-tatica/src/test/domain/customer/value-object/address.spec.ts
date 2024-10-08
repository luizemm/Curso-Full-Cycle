import AddressImpl from "../../../../domain/customer/value-object/address"

describe("Address unit tests", () => {
    it("should throw error when street is empty", () => {
        expect(
            () => new AddressImpl("", 123, "12345-678", "Belo Horizonte")
        ).toThrow("Street is required")
    })

    it("should throw error when number is less than 0", () => {
        expect(
            () => new AddressImpl("Rua X", 0, "12345-678", "Belo Horizonte")
        ).toThrow("Number must be greater than 0")
    })

    it("should throw error when zip is empty", () => {
        expect(
            () => new AddressImpl("Rua X", 123, "", "Belo Horizonte")
        ).toThrow("Zip is required")
    })

    it("should throw error when city is empty", () => {
        expect(() => new AddressImpl("Rua X", 123, "12345-678", "")).toThrow(
            "City is required"
        )
    })
})
