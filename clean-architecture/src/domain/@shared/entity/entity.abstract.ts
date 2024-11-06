import NotificationImpl from "../notification/notification"
import Notification from "../notification/notification-interface"
import NotificationError from "../notification/notification.error"

export default abstract class Entity {
    protected readonly _id: string
    protected readonly notification: Notification

    constructor(id: string) {
        this._id = id
        this.notification = new NotificationImpl()
    }

    protected throwNotificationError() {
        try {
            throw new NotificationError(this.notification.errors)
        } finally {
            this.notification.clearErrors()
        }
    }

    get id(): string {
        return this._id
    }
}
