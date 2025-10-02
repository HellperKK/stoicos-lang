/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { css } from "@emotion/css";
import { useState } from "react";
import "./App.global.css";

import CodeEditor from "./editor/CodeEditor";
import VarManager from "./language/manager/VarManager";
import evaluate from "./language/utils/eval";

export default function AppAdvanced() {
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
				position: relative;
			`}
		>
			<div
				className={css`
					display: grid;
					grid-template-rows: 50px 1fr;
					grid-template-columns: 150px 1fr;
					grid-template-areas: "btns btns" "files code";
					width: 100vw;
					height: 100vh;
					background-color: white;
				`}
			>
				<div
					className={css`
						grid-area: btns;
					`}
				>
					<button type="button" onClick={evalClick}>
						Run
					</button>
				</div>
				<div
					className={css`
						grid-area: files;
					`}
				></div>
				<div>
					<CodeEditor code={code} setCode={setCode} />
				</div>
			</div>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: because */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <because> */}
			<div
				className={css`
					display: ${resultOpened ? "flex" : "none"};
					position: absolute;
					justify-content: center;
					background-color: #000000bd;
					align-items: center;
					inset: 0;
					z-index: 20;
					grid-area: code;
				`}
				onClick={() => setResultOpened(false)}
			>
				{/** biome-ignore lint/a11y/useKeyWithClickEvents: <because> */}
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
						overflow: scroll;
					`}
					onClick={(e) => e.stopPropagation()}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <because>
					dangerouslySetInnerHTML={{ __html: output }}
				/>
			</div>
		</div>
	);
}
