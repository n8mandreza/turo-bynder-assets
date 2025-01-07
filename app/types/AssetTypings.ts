export interface AssetType {
    name: string
    id: string
    url: string
    description?: string
}

export interface CollectionType {
    name: string
    id: string
    collectionCount: number
    cover: any
    thumbnail: string
}