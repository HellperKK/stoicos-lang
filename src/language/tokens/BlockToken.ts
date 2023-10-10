/* eslint-disable import/no-cycle */
import { unitType } from "../utils/Types";
import VarManager from "../manager/VarManager";
import BaseToken from "./BaseToken";

export default class BlockToken extends BaseToken {
  public constructor(value: Array<BaseToken>) {
    super(value, "block");
  }

  public getType() {
    return this.value.length > 0
      ? this.value[this.value.length - 1].getType()
      : unitType;
  }

  public update(): BaseToken {
    return new BlockToken(
      this.value.map((tok: BaseToken) => tok.update())
    ) as BaseToken;
  }

  public calculate() {
    return this.value.reduce(
      (_acc: BaseToken, tok: BaseToken) => tok.get(),
      VarManager.unit
    );
  }

  public request(type: string) {
    switch (type) {
      case "block":
        return this.value;

      default:
        return super.request(type);
    }
  }
}
