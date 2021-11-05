/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import nearley from 'nearley';
import { colorize } from './highlighter';
import renderElement from './syntaxNodes';
import grammar from '../../language/grammar';
import prelude from '../../language/definitions/prelude';
import VarManager from '../../language/manager/VarManager';

declare module 'nearley' {}

function CodeEditor() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [scroll, setScroll] = useState(0);
  const [resultOpened, setResultOpened] = useState(false);
  const cololorized = colorize(code).map(renderElement);

  const evaluate = () => {
    setOutput('');

    VarManager.clean();
    const stdOut = prelude();

    try {
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      const trees = parser.feed(code);
      const { results } = trees;

      if (results.length === 0) {
        throw new Error('no result');
      }

      /* if (results.length > 1) {
            console.log(results)
            throw new Error("too much results")
        } */

      results[0].forEach((token: any) => token && token.get());

      setOutput(stdOut.content);
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(results[0], null, 4));
    } catch (error: any) {
      setOutput(
        (currentOutput: string) =>
          `${currentOutput}\n\n---------------\n\n${error.message}`
      );
      throw error;
    }
    setResultOpened(true);

    // console.log(VarManager.get())
  };

  return (
    <div>
      <div className="editor-grid">
        <button type="button" className="button-run" onClick={evaluate}>
          run
        </button>
        <div className="editor-main">
          <textarea
            className="editor-writer"
            placeholder="your code here..."
            spellCheck="false"
            onChange={(e) => setCode(e.target.value)}
            onScroll={(e) =>
              setScroll((e.target as HTMLTextAreaElement).scrollTop)
            }
            value={code}
          />
          <code className="editor-render" style={{ top: `-${scroll}px` }}>
            {cololorized}
          </code>
        </div>
      </div>
      <div
        className={resultOpened ? 'result-modal' : 'result-modal hidden'}
        onClick={() => setResultOpened(false)}
      >
        <textarea
          className="result-out"
          spellCheck="false"
          readOnly
          onClick={(e) => e.stopPropagation()}
          value={output}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
