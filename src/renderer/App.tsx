/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { css } from '@emotion/css';
import './App.global.css';
import nearley from 'nearley';
import grammar from '../language/grammar';
import prelude from '../language/definitions/prelude';
import VarManager from '../language/manager/VarManager';

import CodeEditor from './editor/CodeEditor';

export default function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [resultOpened, setResultOpened] = useState(false);

  const evaluate = () => {
    console.log(code);
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
      console.log(JSON.stringify(results[0], null, 4));
    } catch (error: any) {
      setOutput(
        (currentOutput: string) =>
          `${currentOutput}\n\n---------------\n\n${error.message}`
      );
      throw error;
    }
    setResultOpened(true);
  };

  return (
    <div
      className={css`
        display: grid;
        grid-template-rows: 50px 1fr;
        width: 100vw;
        height: 100vh;
      `}
    >
      <button type="button" onClick={evaluate}>
        Run
      </button>
      <CodeEditor setCode={setCode} />
      <div
        className={css`
          display: ${resultOpened ? 'flex' : 'none'};
          position: absolute;
          justify-content: center;
          background-color: #000000bd;
          align-items: center;
          top: 0px;
          left: 0px;
          width: 100vw;
          height: 100vh;
          z-index: 20;
        `}
        onClick={() => setResultOpened(false)}
      >
        <textarea
          className={css`
            width: 50vw;
            height: 50vh;
            color: #d1d1d1;
            background-color: #181716;
            outline: none;
            border: none;
            resize: none;
            padding: 4px;
          `}
          spellCheck="false"
          readOnly
          onClick={(e) => e.stopPropagation()}
          value={output}
        />
      </div>
    </div>
  );
}
