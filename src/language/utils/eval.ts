/* eslint-disable no-console */
import nearley from "nearley";
import prelude from "../definitions/prelude";
import grammar from "../grammar";
import VarManager from "../manager/VarManager";
import type BaseToken from "../tokens/BaseToken";

const evaluate = (code: string) => {
	VarManager.clean();
	const { stdOut } = VarManager;

	prelude();

	try {
		const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
		const trees: { results: Array<Array<BaseToken>> } = parser.feed(code);

		const { results } = trees;

		if (results.length === 0) {
			throw new Error("no result");
		}

		results[0].forEach((token) => {token?.get()});

		console.log(JSON.stringify(results[0], null, 4));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error) {
		stdOut.content += `\n\n---------------\n\n${(error as Error).message}`;
		// throw error;
	}
};

export default evaluate;
