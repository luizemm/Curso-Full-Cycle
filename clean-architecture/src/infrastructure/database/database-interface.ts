export default interface Database {
    init(): Promise<void>
    close(): Promise<void>
}
