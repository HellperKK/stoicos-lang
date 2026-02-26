package utils;

import utils.Hashable;
import language.Value;

class HashEntry<K: Hashable, V> {
    public var key: K;
    public var value: V;
    public var hash: String;

    public function new(key: K, value: V) {
        this.key = key;
        this.value = value;
        this.hash = key.hash();
    }
}