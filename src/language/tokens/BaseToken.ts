/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/no-cycle
import objectHash from 'object-hash';
import { HashMap } from '@nebtex/hashmaps';
// eslint-disable-next-line import/no-cycle
import Type from '../utils/Type';

export default abstract class BaseToken {
  public hash(): string {
    return objectHash(this.value);
  }

  public type: string;

  public value: any;

  public constructor(value: any, type: string) {
    this.value = value;
    this.type = type;
  }

  public getType(): Type {
    throw new Error('unsuported here');
  }

  public getTypeName() {
    return this.getType().typeName();
  }

  public getValue() {
    return this.value;
  }

  public get(): BaseToken {
    return this as BaseToken;
  }

  public calculate() {
    return this as BaseToken;
  }

  public call(_other: BaseToken[]) {
    return this as BaseToken;
  }

  public compare(other: BaseToken): number {
    if (other.type < this.type) {
      return 1;
    }

    if (other.type > this.type) {
      return -1;
    }

    if (other.value < this.value) {
      return 1;
    }

    if (other.value > this.value) {
      return -1;
    }

    return 0;
  }

  public request(type: string): any;
  public request(type: 'string'): string;
  public request(type: 'number'): number;
  public request(type: 'bool'): boolean;
  public request(type: 'symbol'): string;
  public request(type: 'array'): Array<BaseToken>;
  public request(type: 'struct'): Map<string, BaseToken>;
  public request(type: 'map'): HashMap<BaseToken, BaseToken>;
  public request(type: 'type'): Type;
  public request(type: 'fun'): (toks: Array<BaseToken>) => BaseToken;
  public request(type: string) {
    switch (type) {
      case 'string':
        return this.value.toString();

      default:
        throw new Error(`Resquested a ${type} for a ${this.type}`);
    }
  }

  public update(): BaseToken {
    return this;
  }
}
