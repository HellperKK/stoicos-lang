import Type from "../utils/Type";
import BaseToken from "./BaseToken";
import { typeType } from "../utils/Types";

export default class TypeToken extends BaseToken {
  public constructor(value: Type) {
    super(value, "type");
  }

  // eslint-disable-next-line class-methods-use-this
  public getType() {
    return typeType;
  }

  public request(type: string) {
    switch (type) {
      case "type":
        return this.value;

      default:
        return super.request(type);
    }
  }
}
