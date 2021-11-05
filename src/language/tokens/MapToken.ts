/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseToken from './BaseToken';

export default class MapToken extends BaseToken {
  public value!: Map<BaseToken, BaseToken>;

  public constructor(value: Map<BaseToken, BaseToken>) {
    super(value, 'map');
  }

  public request(_type: 'map'): Map<BaseToken, BaseToken> {
    return this.value;
  }
}
