import Customer from "../entity/customer"
import Repository from "../../@shared/repository/repository-interface"

export default interface CustomerRepository extends Repository<Customer> {}
