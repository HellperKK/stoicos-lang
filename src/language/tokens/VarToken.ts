import VarManager from '../manager/VarManager';
import BaseToken from './BaseToken';

export default class VarToken extends BaseToken {
  public current: BaseToken;

  public value!: string;

  public constructor(value: string) {
    super(value, 'var');
    this.current = VarManager.unit;
  }

  public get(): BaseToken {
    const manager = VarManager.get();
    if (manager.hasVar(this.value)) {
      return manager.getVar(this.value);
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
