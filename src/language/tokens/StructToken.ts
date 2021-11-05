/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseToken from './BaseToken';

export default class StructToken extends BaseToken {
  public value!: Map<string, BaseToken>;

  public constructor(value: Map<string, BaseToken>) {
    super(value, 'struct');
  }

  public request(_type: 'struct'): Map<string, BaseToken> {
    return this.value;
  }
}
