import VarManager from "../manager/VarManager";
import BaseToken from "./BaseToken";
import VarToken from "./VarToken";

export default class AttrToken extends VarToken {
  public attrs: Array<string>;

  public constructor(value: string, attrs: Array<string>) {
    super(value);
    this.attrs = attrs;
  }

  public getType() {
    return this.get().getType();
  }

  public get() {
    const manager = VarManager.get();
    if (manager.hasVar(this.value)) {
      const tok = manager.getVar(this.value);

      const res = this.attrs.reduce(
        (tokent, attr) => {
          return tokent.request("struct").get(attr) ?? VarManager.unit
        },
        tok
      );
      return res;
    }

    if (this.current === null) {
      throw new Error(`Value ${this.value} not found`);
    }

    return this.current;
  }

  public update() {
    try {
      const newAttr = new AttrToken(this.value, this.attrs);
      newAttr.current = newAttr.get();
      return newAttr;
    } catch (error) {
      return this;
    }
  }
}
