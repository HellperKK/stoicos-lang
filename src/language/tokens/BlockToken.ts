/* eslint-disable @typescript-eslint/no-unused-vars */
import VarManager from '../manager/VarManager';
import BaseToken from './BaseToken';

export default class BlockToken extends BaseToken {
  public value!: Array<BaseToken>;

  public constructor(value: Array<BaseToken>) {
    super(value, 'block');
  }

  public update(): BaseToken {
    return new BlockToken(this.value.map((tok) => tok.update())) as BaseToken;
  }

  public calculate() {
    return this.value.reduce((_acc, tok) => tok.get(), VarManager.unit);
  }

  public request(type: string) {
    switch (type) {
      case 'block':
        return this.value;

      default:
        return super.request(type);
    }
  }
}
