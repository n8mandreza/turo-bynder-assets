// Type definitions for the Bynder API

export interface AssetType {
    name: string
    id: string
    url: string
    description?: string
}

export interface CollectionType {
    name: string
    id: string
    collectionCount?: number
    thumbnail?: string
    description?: string
    user?: { id: string, name: string, }
}