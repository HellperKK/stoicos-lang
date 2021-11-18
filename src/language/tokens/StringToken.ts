import BaseToken from './BaseToken';

export default class StringToken extends BaseToken {
  public value!: string;

  public constructor(value: string) {
    super(value, 'string');
  }

  public request(type: string) {
    switch (type) {
      case 'string':
        return this.value;

      default:
        return super.request(type);
    }
  }
}
