import { NotificationErrorProps } from "./notification-interface"

export default class NotificationError extends Error {
    constructor(public errors: NotificationErrorProps[]) {
        super(
            errors
                .map(({ context, message }) => `${context}: ${message}`)
                .join(", ")
        )
    }
}
