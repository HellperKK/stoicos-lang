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
    const tok = super.get();
    const res = this.attrs.reduce(
      (_tok, attr) => tok.request("struct").get(attr) as BaseToken,
      tok
    );
    return res;
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
