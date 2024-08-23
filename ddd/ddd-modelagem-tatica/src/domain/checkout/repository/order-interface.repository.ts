import Order from "../entity/order"
import Repository from "../../@shared/repository/repository-interface"

export default interface OrderRepository extends Repository<Order> {}
