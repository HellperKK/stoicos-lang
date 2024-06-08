import VarManager from "../manager/VarManager";
import BaseToken from "./BaseToken";
import FunToken from "./FunToken";

export default class PartialFunToken extends BaseToken {
  public current: BaseToken | null;

  public constructor(value: BaseToken) {
    super(value, "var");
    this.current = null;
  }

  public get(): BaseToken {
    return FunToken.native(tokens =>  FunToken.native(tokensbis => this.value.get().call(tokens.concat(tokensbis))));
  }

  public update():BaseToken {
    return new PartialFunToken(this.value.update())
  }
}
