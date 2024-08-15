import Order from "../entity/order"
import Repository from "./repository-interface"

export default interface OrderRepository extends Repository<Order> {}
