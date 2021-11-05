/* eslint-disable @typescript-eslint/no-unused-vars */
import ArrayToken from './ArrayToken';
import BaseToken from './BaseToken';

export default class ArrayModelToken extends BaseToken {
  public value!: Array<BaseToken>;

  public constructor(value: Array<BaseToken>) {
    super(value, 'arrayModel');
  }

  public update(): BaseToken {
    return new ArrayModelToken(
      this.value.map((tok) => tok.update())
    ) as BaseToken;
  }

  public get() {
    return new ArrayToken(this.value.map((tok) => tok.get()));
  }
}
