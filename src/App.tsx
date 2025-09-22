/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";
import { css } from "@emotion/css";
import "./App.global.css";

import evaluate from "./language/utils/eval";
import VarManager from "./language/manager/VarManager";
import CodeEditor from "./editor/CodeEditor";

export default function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [resultOpened, setResultOpened] = useState(false);

  const evalClick = () => {
    evaluate(code);
    setResultOpened(true);
    setOutput(VarManager.stdOut.content);
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
      <button type="button" onClick={evalClick}>
        Run
      </button>
      <CodeEditor code={code} setCode={setCode} />
      <div
        className={css`
          display: ${resultOpened ? "flex" : "none"};
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
        <pre
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
          onClick={(e) => e.stopPropagation()}
          dangerouslySetInnerHTML={{__html:output}}
        />
      </div>
    </div>
  );
}
