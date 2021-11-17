import BaseToken from './BaseToken';

export default class SymbolToken extends BaseToken {
  public value!: string;

  public constructor(value: string) {
    super(value, 'symbol');
  }

  public request(type: string) {
    switch (type) {
      case 'symbol':
        return this.value;

      default:
        return super.request(type);
    }
  }
}
