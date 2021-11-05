/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseToken from './BaseToken';
import VarToken from './VarToken';

export default class AttrToken extends VarToken {
  public current!: BaseToken;

  public value!: string;

  public attrs: Array<string>;

  public constructor(value: any, attrs: Array<string>) {
    super(value);
    this.attrs = attrs;
  }

  public get() {
    const tok = super.get();
    const res = this.attrs.reduce(
      (_tok, attr) => tok.request('struct').get(attr),
      tok
    );
    return res;
  }

  public update() {
    try {
      const newAttr = new AttrToken(this.value, this.attrs);
      const tok = super.get();
      newAttr.current = this.attrs.reduce(
        (_tok, attr) => _tok.request('struct').get(attr),
        tok
      );
      return newAttr;
    } catch (error) {
      return this;
    }
  }
}
