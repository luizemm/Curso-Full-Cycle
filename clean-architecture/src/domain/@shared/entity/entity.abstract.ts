import NotificationImpl from "../notification/notification"
import Notification from "../notification/notification-interface"
import NotificationError from "../notification/notification.error"
import Entity from "./entity-interface"

export default abstract class AbstractEntity implements Entity {
    protected readonly _id: string
    private readonly _notification: Notification

    constructor(id: string) {
        this._id = id
        this._notification = new NotificationImpl()
    }

    protected throwNotificationError() {
        try {
            throw new NotificationError(this._notification.errors)
        } finally {
            this._notification.clearErrors()
        }
    }

    get id(): string {
        return this._id
    }

    get notification(): Notification {
        return this._notification
    }
}
