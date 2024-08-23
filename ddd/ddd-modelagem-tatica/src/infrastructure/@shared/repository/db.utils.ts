export type HasId = { id: string; [key: string]: unknown }

export type Delta<T> = {
    added: T[]
    changed: T[]
    deleted: T[]
}

export function getDeltas<T extends HasId>(
    source: T[],
    updated: T[]
): Delta<T> {
    let added = updated.filter(
        updatedItem =>
            source.find(sourceItem => sourceItem.id === updatedItem.id) ===
            undefined
    )
    let changed = updated.filter(
        sourceItem =>
            source.find(updatedItem => updatedItem.id === sourceItem.id) !==
            undefined
    )
    let deleted = source.filter(
        sourceItem =>
            updated.find(updatedItem => updatedItem.id === sourceItem.id) ===
            undefined
    )

    const delta: Delta<T> = {
        added: added,
        changed: changed,
        deleted: deleted,
    }

    return delta
}
