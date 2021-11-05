import BaseToken from './BaseToken';

export default class SymbolToken extends BaseToken {
  public value!: string;

  public constructor(value: string) {
    super(value, 'symbol');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public request(_type: 'symbol'): string {
    return this.value;
  }
}
