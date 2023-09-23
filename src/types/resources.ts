export interface IResources {
    name: string,
    quantityAvailable: number | undefined, // if the resource is quantifiable
    usedFor: string
}