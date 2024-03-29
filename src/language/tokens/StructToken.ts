import Type from "../utils/Type";
import BaseToken from "./BaseToken";
// eslint-disable-next-line import/no-cycle
import { makeStructType } from "../utils/Types";

export default class StructToken extends BaseToken {
  public constructor(value: Map<string, BaseToken>) {
    super(value, "struct");
  }

  public getType() {
    const parameters = new Map<string, Type>();

    this.value.forEach((value: BaseToken, key: string) => {
      parameters.set(key, value.getType());
    });

    return makeStructType(parameters);
  }

  public request(type: string) {
    switch (type) {
      case "struct":
        return this.value;

      default:
        return super.request(type);
    }
  }
}
