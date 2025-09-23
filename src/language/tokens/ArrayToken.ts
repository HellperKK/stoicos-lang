import type Type from "../utils/Type";
import { dynamicType, makeArrayType } from "../utils/Types";
import BaseToken from "./BaseToken";

export default class ArrayToken extends BaseToken {
	public constructor(value: Array<BaseToken>) {
		super(value, "array");
	}

	public getType() {
		const types: Array<Type> = [];
		this.value.forEach((token: BaseToken) => {
			const type = token.getType();
			const index = types.findIndex(
				(t: Type) => t.typeName() === type.typeName(),
			);

			if (index === -1) {
				types.push(type);
			}
		});

		const type = types.length === 1 ? types[0] : dynamicType;

		return makeArrayType(type);
	}

	public update(): BaseToken {
		return new ArrayToken(
			this.value.map((tok: BaseToken) => tok.update()),
		) as BaseToken;
	}

	public request(type: string) {
		switch (type) {
			case "array":
				return this.value;

			case "string":
				return (
					"[" +
					this.value.map((tok: BaseToken) => tok.request("string")).join(" ") +
					"]"
				);

			default:
				return super.request(type);
		}
	}
}
