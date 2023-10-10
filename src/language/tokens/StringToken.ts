import BaseToken from "./BaseToken";
import { stringType } from "../utils/Types";

export default class StringToken extends BaseToken {
  public constructor(value: string) {
    super(value, "string");
  }

  // eslint-disable-next-line class-methods-use-this
  public getType() {
    return stringType;
  }

  public request(type: string) {
    switch (type) {
      case "string":
        return this.value;

      default:
        return super.request(type);
    }
  }
}
