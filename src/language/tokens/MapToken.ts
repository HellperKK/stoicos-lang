// import { HashMap } from "@nebtex/hashmaps";

import type { HashMapTemp } from "../utils/HashMapTemp";
import type Type from "../utils/Type";
import { dynamicType, makeMapType } from "../utils/Types";
import BaseToken from "./BaseToken";

export default class MapToken extends BaseToken {
	public constructor(value: HashMapTemp<BaseToken, BaseToken>) {
		super(value, "map");
	}

	// eslint-disable-next-line class-methods-use-this
	public getType() {
		const keyTypes: Array<Type> = [];
		const valueTypes: Array<Type> = [];

		this.value.forEach((key: BaseToken, value: BaseToken) => {
			if (key === undefined) {
				throw new Error("error");
			}
			if (value === undefined) {
				throw new Error("error");
			}

			const keyType = key.getType();
			const keyIndex = keyTypes.findIndex(
				(t: Type) => t.typeName() === keyType.typeName(),
			);

			if (keyIndex === -1) {
				keyTypes.push(keyType);
			}

			const valueType = value.getType();
			const valueIndex = valueTypes.findIndex(
				(t: Type) => t.typeName() === valueType.typeName(),
			);

			if (valueIndex === -1) {
				valueTypes.push(valueType);
			}
		});

		const keyType = keyTypes.length === 1 ? keyTypes[0] : dynamicType;
		const valueType = valueTypes.length === 1 ? valueTypes[0] : dynamicType;

		return makeMapType([keyType, valueType]);
	}

	public request(type: string) {
		switch (type) {
			case "map":
				return this.value;

			default:
				return super.request(type);
		}
	}
}
