/* eslint-disable no-console */
import nearley from 'nearley';
import grammar from '../grammar';
import prelude from '../definitions/prelude';
import VarManager from '../manager/VarManager';
import BaseToken from '../tokens/BaseToken';

const evaluate = (code: string) => {
  VarManager.clean();
  const { stdOut } = VarManager;

  prelude();

  try {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    const trees: { results: Array<Array<BaseToken>> } = parser.feed(code);
    const { results } = trees;

    if (results.length === 0) {
      throw new Error('no result');
    }

    results[0].forEach((token) => token && token.get());

    console.log(JSON.stringify(results[0], null, 4));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    stdOut.content += `\n\n---------------\n\n${error.message}`;
    throw error;
  }
};

export default evaluate;
