/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default class BaseToken {
  public type: string;

  public value: any;

  public constructor(value: any, type: string) {
    this.value = value;
    this.type = type;
  }

  public getType() {
    return this.type;
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

  public call(_other: any[]) {
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

  public request(type: string): any {
    switch (type) {
      case 'string':
        return this.value.toString();

      default:
        throw new Error(`Resquested a ${type} for a ${this.type}`);
    }
  }

  public update() {
    return this as BaseToken;
  }
}
