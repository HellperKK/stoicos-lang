import { numberType } from "../utils/Types";
import BaseToken from "./BaseToken";

export default class NumberToken extends BaseToken {
	public constructor(value: number) {
		super(value, "number");
	}

	// eslint-disable-next-line class-methods-use-this
	public getType() {
		return numberType;
	}

	public request(type: string) {
		switch (type) {
			case "number":
				return this.value;

			default:
				return super.request(type);
		}
	}
}
