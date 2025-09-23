/* eslint-disable import/no-cycle */
/* eslint-disable class-methods-use-this */
import VarManager from "../manager/VarManager";
import BaseToken from "./BaseToken";
import type BlockToken from "./BlockToken";

export default class FunToken extends BaseToken {
	public static native(value: (toks: Array<BaseToken>) => BaseToken) {
		return new FunToken(value);
	}

	public static custom(args: Array<BaseToken>, block: BlockToken) {
		const nblock = block.update();
		return new FunToken(
			(toks) => {
				const vars = VarManager.get();

				vars.addStack();

				args.forEach((sym, pos) => {
					vars.setVar(sym.request("symbol"), toks[pos], false);
				});

				const ret = nblock.calculate();

				vars.delStack();

				return ret;
			},
			args.map((tok) => tok.request("string")),
		);
	}

	public args: Array<string>;

	public constructor(
		value: (toks: Array<BaseToken>) => BaseToken,
		args: Array<string> = [],
	) {
		super(value, "fun");
		this.args = args;
	}

	public call(args: Array<BaseToken>) {
		return this.value(args);
	}

	public compare() {
		return 0;
	}

	public request(type: string) {
		switch (type) {
			case "fun":
				return this.value;

			default:
				return super.request(type);
		}
	}
}
