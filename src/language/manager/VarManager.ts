import BaseToken from '../tokens/BaseToken';
import UnitToken from '../tokens/UnitToken';
import Var from './Var';
import { dynamicType } from '../utils/Types';
import Type from '../utils/Type';

export default class VarManager {
  private static instance: VarManager;

  public static unit = new UnitToken();

  public static stdOut = { content: '' };

  public static get() {
    if (this.instance == null) {
      this.instance = new VarManager();
    }

    return this.instance;
  }

  public static clean() {
    this.instance = new VarManager();
    this.stdOut.content = '';
  }

  private dicts: Array<Map<string, Var>>;

  private constructor() {
    this.dicts = [new Map<string, Var>()];
  }

  public hasVar(name: string) {
    return this.dicts[0].has(name);
  }

  public typeVar(name: string, type: Type) {
    if (this.dicts[0] && this.dicts[0].has(name)) {
      this.dicts[0].get(name)?.setType(type);
    } else {
      this.dicts[0].set(name, new Var(VarManager.unit, false, type));
    }
  }

  public setVar(name: string, value: BaseToken, cons: boolean) {
    if (this.dicts[0] && this.dicts[0].has(name)) {
      this.dicts[0].get(name)?.setVal(value);
    } else {
      this.dicts[0].set(name, new Var(value, cons, dynamicType));
    }
  }

  public getVar(name: string) {
    const token = this.dicts
      .find((d) => d.has(name))
      ?.get(name)
      ?.getVal();

    if (token === undefined) {
      throw new Error(`Value ${name} not found`);
    }

    return token;
  }

  public delete(name: string) {
    if (this.dicts[0].has(name)) {
      this.dicts[0].delete(name);
    }

    throw new Error(`Value ${name} can't be removed`);
  }

  public addStack() {
    if (this.dicts.length >= 5000) throw new Error('Max stack reached');

    this.dicts.unshift(new Map<string, Var>());
  }

  public delStack() {
    if (this.dicts.length <= 1) throw new Error('Min stack reached');
    return this.dicts.shift();
  }

  public getStack() {
    return this.dicts[0];
  }
}
