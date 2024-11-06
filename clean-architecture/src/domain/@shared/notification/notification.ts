import Notification, { NotificationErrorProps } from "./notification-interface"

export default class NotificationImpl implements Notification {
    private _errors: NotificationErrorProps[] = []

    addError(error: NotificationErrorProps): void {
        this._errors.push(error)
    }

    hasErrors(): boolean {
        return this._errors.length > 0
    }

    clearErrors(): void {
        this._errors = []
    }

    get errors(): NotificationErrorProps[] {
        return this._errors
    }

    messages(context?: string): string {
        const filteredErrors = this._errors.filter(
            error => !context || error.context === context
        )

        return filteredErrors
            .map(({ context, message }) => `${context}: ${message}`)
            .join(", ")
    }
}
