import Product from "../entity/product";
import Repository from "./repository-interface";

export default interface ProductRepository extends Repository<Product> {}