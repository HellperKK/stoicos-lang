// eslint-disable-next-line import/no-cycle
import BaseToken from '../tokens/BaseToken';

export default class Type {
  public name: string;

  public parameters: Array<Type>;

  public compatible: (token: BaseToken) => boolean;

  constructor(
    name: string,
    parameters: Array<Type>,
    compatible: (this: Type, token: BaseToken) => boolean
  ) {
    this.name = name;
    this.parameters = parameters;
    this.compatible = compatible;
  }

  public typeName(): string {
    return `${this.name}<${this.parameters
      .map((param) => param.typeName())
      .join(', ')}>`;
  }
}
