export interface InputListCustomerDto {}

export type CustomerDto = {
    id: string
    name: string
    address?: {
        street: string
        number: number
        zip: string
        city: string
    }
}

export interface OutputListCustomerDto {
    customers: CustomerDto[]
}
