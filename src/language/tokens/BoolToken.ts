import BaseToken from './BaseToken';
import { boolType } from '../utils/Types';

export default class BoolToken extends BaseToken {
  public value!: boolean;

  public constructor(value: boolean) {
    super(value, 'bool');
  }

  // eslint-disable-next-line class-methods-use-this
  public getType() {
    return boolType;
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
