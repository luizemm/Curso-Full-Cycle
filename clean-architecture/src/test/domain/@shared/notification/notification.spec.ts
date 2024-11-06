import NotificationImpl from "../../../../domain/@shared/notification/notification"
import Notification, {
    NotificationErrorProps,
} from "../../../../domain/@shared/notification/notification-interface"

describe("Unit test Notification", () => {
    it("should create errors", () => {
        const notification: Notification = new NotificationImpl()
        const error: NotificationErrorProps = {
            message: "error message",
            context: "customer",
        }

        notification.addError(error)

        expect(notification.messages("customer")).toBe(
            "customer: error message"
        )

        const error2: NotificationErrorProps = {
            message: "error message 2",
            context: "customer",
        }

        notification.addError(error2)

        expect(notification.messages("customer")).toBe(
            "customer: error message, customer: error message 2"
        )

        const error3: NotificationErrorProps = {
            message: "error message",
            context: "order",
        }

        notification.addError(error3)

        expect(notification.messages("customer")).toBe(
            "customer: error message, customer: error message 2"
        )

        expect(notification.messages()).toBe(
            "customer: error message, customer: error message 2, order: error message"
        )
    })

    it("should check if notification has at least one error", () => {
        const notification: Notification = new NotificationImpl()
        const error: NotificationErrorProps = {
            message: "error message",
            context: "customer",
        }

        notification.addError(error)

        expect(notification.hasErrors()).toBeTruthy()
    })

    it("should get all errors props", () => {
        const notification: Notification = new NotificationImpl()

        const error: NotificationErrorProps = {
            message: "error message",
            context: "customer",
        }

        notification.addError(error)

        expect(notification.errors).toEqual([error])
    })
})
