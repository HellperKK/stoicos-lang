/* eslint-disable no-restricted-syntax */
import BaseToken from '../tokens/BaseToken';
import UnitToken from '../tokens/UnitToken';
import Var from './Var';

export default class VarManager {
  private static Instance: VarManager;

  public static unit = new UnitToken();

  public static get() {
    if (this.Instance == null) {
      this.Instance = new VarManager();
    }

    return this.Instance;
  }

  public static clean() {
    this.Instance = new VarManager();
  }

  private dicts: Array<Map<string, Var>>;

  private constructor() {
    this.dicts = [new Map<string, Var>()];
  }

  public hasVar(name: string) {
    return this.dicts[0].has(name);
  }

  public setVar(name: string, value: BaseToken, cons: boolean) {
    if (this.dicts[0] && this.dicts[0].has(name)) {
      this.dicts[0].get(name)?.setVal(value);
    } else {
      this.dicts[0].set(name, new Var(value, cons, 'Dynamic'));
    }
  }

  public getVar(name: string) {
    for (const dict of this.dicts) {
      if (dict.has(name)) {
        return dict.get(name)?.getVal() ?? VarManager.unit;
      }
    }

    throw new Error(`Value ${name} not found`);
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
