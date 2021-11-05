/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseToken from './BaseToken';

export default class BoolToken extends BaseToken {
  public value!: boolean;

  public constructor(value: boolean) {
    super(value, 'bool');
  }

  public request(_type: 'bool'): boolean {
    return this.value;
  }
}
