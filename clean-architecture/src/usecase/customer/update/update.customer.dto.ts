/*
Mesmo o input e o output sendo iguais,
a nossa tendência é utilizar um único dto para ambos,
porém no futuro os campos de cada um podem ser alterados
logo o correto e deixar separado
*/
export interface InputUpdateCustomerDto {
    id: string
    name: string
    address:
        | {
              street: string
              number: number
              zip: string
              city: string
          }
        | undefined
}

export interface OutputUpdateCustomerDto {
    id: string
    name: string
    address:
        | {
              street: string
              number: number
              zip: string
              city: string
          }
        | undefined
}
