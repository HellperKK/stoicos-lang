// eslint-disable-next-line import/no-cycle
import type BaseToken from "../tokens/BaseToken";

export default class Type {
	public name: string;

	public parameters: Array<Type>;

	public compatible: (token: BaseToken) => boolean;

	constructor(
		name: string,
		parameters: Array<Type>,
		compatible: (this: Type, token: BaseToken) => boolean,
	) {
		this.name = name;
		this.parameters = parameters;
		this.compatible = compatible;
	}

	public typeName(): string {
		if (this.parameters.length === 0) {
			return this.name;
		}

		return `${this.name}<${this.parameters
			.map((param) => param.typeName())
			.join(", ")}>`;
	}
}
