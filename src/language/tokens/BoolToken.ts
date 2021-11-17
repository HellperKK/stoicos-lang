/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseToken from './BaseToken';

export default class BoolToken extends BaseToken {
  public value!: boolean;

  public constructor(value: boolean) {
    super(value, 'bool');
  }

  public request(type: string) {
    switch (type) {
      case 'bool':
        return this.value;

      default:
        return super.request(type);
    }
  }
}
