/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseToken from './BaseToken';

export default class ArrayToken extends BaseToken {
  public value!: Array<BaseToken>;

  public constructor(value: Array<BaseToken>) {
    super(value, 'array');
  }

  public update(): BaseToken {
    return new ArrayToken(this.value.map((tok) => tok.update())) as BaseToken;
  }

  public request(type: string) {
    switch (type) {
      case 'array':
        return this.value;

      default:
        return super.request(type);
    }
  }
}
