package utils;

import utils.Hashable;
import language.Value;

using Lambda;

class HashMap<K: Hashable, V> {
    private var hashEntries:Array<HashEntry<K, V>>;
    public function new() {
        this.hashEntries = [];
    }

    public function set(key:K, value:V):Void {
        var hash = key.hash();
        var entry = this.hashEntries.find(e -> e.hash == hash);
        if (entry != null) {
            entry.value = value;
        } else {
            this.hashEntries.push(new HashEntry(key, value));
        }
    }

    public function get(key:K):V {
        var hash = key.hash();
        var entry = this.hashEntries.find(e -> e.hash == hash);
        if (entry != null) {
            return entry.value;
        }
        return null;
    }

    public function has(key:K):Bool {
        var hash = key.hash();
        return this.hashEntries.exists(e -> e.hash == hash);
    }

    public function keys():Iterator<K> {
        return this.hashEntries.map(e -> e.key).iterator();
    }

    public function values():Iterator<V> {
        return this.hashEntries.map(e -> e.value).iterator();
    }

    public function keyValueIterator():Iterator<{ key: K, value: V }> {
        return this.hashEntries.map(e -> { key: e.key, value: e.value }).iterator();
    }

    public function copy():HashMap<K, V> {
        var newMap = new HashMap<K, V>();
        for (entry in this.hashEntries) {
            newMap.set(entry.key, entry.value);
        }
        return newMap;
    }
}