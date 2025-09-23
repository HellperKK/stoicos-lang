import { symbolType } from "../utils/Types";
import BaseToken from "./BaseToken";

export default class SymbolToken extends BaseToken {
	public constructor(value: string) {
		super(value, "symbol");
	}

	// eslint-disable-next-line class-methods-use-this
	public getType() {
		return symbolType;
	}

	public request(type: string) {
		switch (type) {
			case "symbol":
				return this.value;

			default:
				return super.request(type);
		}
	}
}
