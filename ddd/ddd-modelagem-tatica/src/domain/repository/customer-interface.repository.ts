import Customer from "../entity/customer"
import Repository from "./repository-interface"

export default interface CustomerRepository extends Repository<Customer> {}
