import BaseToken from '../tokens/BaseToken';

export default class Var {
  private val: BaseToken;

  private cons: boolean;

  private type: string;

  public constructor(value: BaseToken, cons: boolean, type: string) {
    this.val = value;
    this.cons = cons;
    this.type = type;
  }

  public setVal(newVal: BaseToken) {
    if (this.cons) throw new Error('Const modification');
    if (this.type !== newVal.getType())
      throw new Error(
        `Type ${newVal.getType()} incompatible with type ${this.type}`
      );

    this.val = newVal;
  }

  public getVal() {
    return this.val;
  }
}
