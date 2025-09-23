/* eslint-disable import/no-cycle */
/* eslint-disable func-names */

import type BaseToken from "../tokens/BaseToken";
import type FunToken from "../tokens/FunToken";
import type StructToken from "../tokens/StructToken";
import Type from "./Type";

const dynamicType = new Type("dynamic", [], () => true);

const makeArrayType = (type = dynamicType) =>
	new Type("array", [type], function (token) {
		if (token.type !== this.name) {
			return false;
		}

		const arr = token.request("array");

		return arr.every((tok) => this.parameters[0].compatible(tok));
	});

const makeMapType = (type = [dynamicType, dynamicType]) =>
	new Type("map", type, function (token) {
		if (token.type !== this.name) {
			return false;
		}

		const pairs = Array.from(token.request("map").entries());

		return pairs.every(
			([key, value]) =>
				this.parameters[0].compatible(key) &&
				this.parameters[1].compatible(value),
		);
	});

const makeStructType = (type = new Map<string, Type>()) =>
	new Type("struct", [], function (token) {
		if (token.type !== this.name) {
			return false;
		}

		const values = (token as StructToken).value;

		let ret = true;

		type.forEach((value: Type, key: string) => {
			if (!values.has(key) || !value.compatible(values.get(key) as BaseToken)) {
				ret = false;
			}
		});

		return ret;
	});

const makeFunType = (params: Array<string>) =>
	new Type("fun", Array(params.length).fill(dynamicType), function (token) {
		if (token.type !== this.name) {
			return false;
		}

		return (token as FunToken).args.length === this.parameters.length;
	});

const makeUnionType = (types: Array<Type>) =>
	new Type("union", types, function (token) {
		return this.parameters.some((type) => type.compatible(token));
	});

const numberType = new Type("number", [], function (token) {
	return token.type === this.name;
});
const unitType = new Type("number", [], function (token) {
	return token.type === this.name;
});

const boolType = new Type("bool", [], function (token) {
	return token.type === this.name;
});

const stringType = new Type("string", [], function (token) {
	return token.type === this.name;
});

const symbolType = new Type("symbol", [], function (token) {
	return token.type === this.name;
});

const blockType = new Type("block", [], function (token) {
	return token.type === this.name;
});

const structType = new Type("block", [], function (token) {
	return token.type === this.name;
});

const typeType = new Type("type", [], function (token) {
	return token.type === this.name;
});

const arrayType = makeArrayType();

const mapType = makeMapType();

export {
	makeArrayType,
	makeMapType,
	makeStructType,
	makeUnionType,
	makeFunType,
	dynamicType,
	numberType,
	unitType,
	boolType,
	stringType,
	symbolType,
	blockType,
	arrayType,
	mapType,
	structType,
	typeType,
};
