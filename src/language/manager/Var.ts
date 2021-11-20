import BaseToken from '../tokens/BaseToken';
import Type from '../utils/Type';

export default class Var {
  private val: BaseToken;

  private cons: boolean;

  private type: Type;

  public constructor(value: BaseToken, cons: boolean, type: Type) {
    this.val = value;
    this.cons = cons;
    this.type = type;
  }

  public setVal(newVal: BaseToken) {
    if (this.cons) throw new Error('Const modification');
    if (!this.type.compatible(newVal))
      throw new Error(
        `Type ${newVal.getType()} incompatible with type ${this.type.typeName()}`
      );

    this.val = newVal;
  }

  public getVal() {
    return this.val;
  }

  public setType(type: Type) {
    this.type = type;
  }
}
