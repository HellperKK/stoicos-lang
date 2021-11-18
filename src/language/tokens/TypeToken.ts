import Type from '../utils/Type';
import BaseToken from './BaseToken';

export default class TypeToken extends BaseToken {
  public value!: Type;

  public constructor(value: Type) {
    super(value, 'type');
  }

  public request(type: string) {
    switch (type) {
      case 'type':
        return this.value;

      default:
        return super.request(type);
    }
  }
}
