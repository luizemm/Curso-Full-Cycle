export type NotificationErrorProps = {
    message: string
    context: string
}

export default interface Notification {
    addError(error: NotificationErrorProps): void
    hasErrors(): boolean
    clearErrors(): void
    get errors(): NotificationErrorProps[]
    messages(context?: string): string
}
