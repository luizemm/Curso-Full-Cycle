// Add product
export interface AddProductFacadeInputDto {
    id?: string
    name: string
    description: string
    purchasePrice: number
    stock: number
}

// Check stock
export interface CheckStockFacadeInputDto {
    productId: string
}

export interface CheckStockFacadeOutputDto {
    productId: string
    stock: number
}
