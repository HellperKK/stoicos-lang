/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseToken from './BaseToken';

export default class NumberToken extends BaseToken {
  public value!: number;

  public constructor(value: number) {
    super(value, 'number');
  }

  public request(_type: 'number'): number {
    return this.value;
  }
}
