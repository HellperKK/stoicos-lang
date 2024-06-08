import VarManager from "../manager/VarManager";
import BaseToken from "./BaseToken";
import FunToken from "./FunToken";

export default class PartialFunToken extends BaseToken {
  public constructor(value: BaseToken) {
    super(value.update(), "var");
  }

  public get(): BaseToken {
    return FunToken.native(tokens =>  FunToken.native(tokensbis => this.value.get().call(tokens.concat(tokensbis))));
  }

  public update():BaseToken {
    console.log("updated", this.value.update());
    return new PartialFunToken(this.value.update());
  }
}
