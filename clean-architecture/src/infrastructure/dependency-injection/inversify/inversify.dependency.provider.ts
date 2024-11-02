import { Container } from "inversify"
import DependencyProvider from "../dependency.provider-interface"
import createContainer from "./inversify.config"

export default class InversifyDependencyProvider implements DependencyProvider {
    private readonly container: Container

    constructor() {
        this.container = createContainer()
    }

    get<T>(name: symbol): T {
        return this.container.get<T>(name)
    }
}
