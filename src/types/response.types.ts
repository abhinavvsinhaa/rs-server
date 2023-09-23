export type Error = {
    message: string,
    err: any,
    code?: number
}

export type Success = {
    message: string,
    code?: number,
    data?: any
}