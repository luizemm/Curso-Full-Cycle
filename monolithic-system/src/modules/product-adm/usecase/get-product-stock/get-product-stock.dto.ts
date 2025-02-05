export interface GetProductStockInputDto {
    productId: string
}

export interface GetProductStockOutputDto {
    productId: string
    stock: number
}
