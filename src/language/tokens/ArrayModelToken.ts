import Type from '../utils/Type';
import ArrayToken from './ArrayToken';
import BaseToken from './BaseToken';

export default class ArrayModelToken extends BaseToken {
  public value!: Array<BaseToken>;

  public constructor(value: Array<BaseToken>) {
    super(value, 'arrayModel');
  }

  // eslint-disable-next-line class-methods-use-this
  public getType(): Type {
    throw new Error('should not happen');
  }

  public update(): BaseToken {
    return new ArrayModelToken(
      this.value.map((tok) => tok.update())
    ) as BaseToken;
  }

  public get() {
    return new ArrayToken(this.value.map((tok) => tok.get())) as BaseToken;
  }
}
