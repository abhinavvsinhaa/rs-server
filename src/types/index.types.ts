type ExcludeKeys<T, K extends keyof T> = Omit<T, K>;

type Prettify<T> = {
    [K in keyof T]: T[K]
}