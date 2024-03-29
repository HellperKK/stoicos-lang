import VarManager from "../manager/VarManager";
import BaseToken from "./BaseToken";

export default class VarToken extends BaseToken {
  public current: BaseToken | null;

  public constructor(value: string) {
    super(value, "var");
    this.current = null;
  }

  // eslint-disable-next-line class-methods-use-this
  public getType() {
    return this.get().getType();
  }

  public get(): BaseToken {
    const manager = VarManager.get();
    if (manager.hasVar(this.value)) {
      return manager.getVar(this.value);
    }

    if (this.current === null) {
      throw new Error(`Value ${this.value} not found`);
    }

    return this.current;
  }

  public update() {
    try {
      const newVar = new VarToken(this.value);
      newVar.current = VarManager.get().getVar(this.value);
      return newVar;
    } catch (error) {
      return this;
    }
  }
}
