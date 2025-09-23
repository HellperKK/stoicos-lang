interface Hashable {
  hash: () => string;
}

interface Pair<K, V> {
  hash: string;
  key: K;
  value: V;
}

export class HashMapTemp<K extends Hashable, V> {
  private pairs: Array<Pair<K, V>>;

  constructor() {
    this.pairs = [];
  }

  public set(key: K, value: V) {
    const hash = key.hash();
    const pair = this.pairs.find((p) => p.hash === hash);

    if (pair !== undefined) {
      pair.value = value;
      return;
    }

    this.pairs.push({ hash, key, value });
  }

  public get(key: K) {
    const hash = key.hash();
    return this.pairs.find((p) => p.hash === hash)?.value;
  }

  public foreach(iterator: (key: K, value: V) => void) {
    this.pairs.forEach((pair) => {iterator(pair.key, pair.value)});
  }

  public *keys(): Generator<K> {
    for (const pair of this.pairs) {
      yield pair.key;
    }
  }

  public *values(): Generator<V> {
    for (const pair of this.pairs) {
      yield pair.value;
    }
  }

  public *entries(): Generator<[K, V]> {
    for (const pair of this.pairs) {
      yield [pair.key, pair.value];
    }
  }
}
