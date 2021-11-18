import BaseToken from './BaseToken';

export default class NumberToken extends BaseToken {
  public value!: number;

  public constructor(value: number) {
    super(value, 'number');
  }

  public request(type: string) {
    switch (type) {
      case 'number':
        return this.value;

      default:
        return super.request(type);
    }
  }
}
