export interface IDeserializable<T> {
    deserialize(path: string): T;
}