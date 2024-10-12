export default interface UseCase<T, U> {
    execute(input: T): Promise<U>
}
