import Notification from "../notification/notification-interface"

export default interface Entity {
    get id(): string
    get notification(): Notification
}
