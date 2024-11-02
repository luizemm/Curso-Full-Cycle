export default interface DependencyProvider {
    get<T>(name: symbol): T
}
