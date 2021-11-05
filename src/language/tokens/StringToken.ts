/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseToken from './BaseToken';

export default class StringToken extends BaseToken {
  public value!: string;

  public constructor(value: string) {
    super(value, 'string');
  }

  public request(_type: 'string'): string {
    return this.value;
  }
}
