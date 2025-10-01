import Prism from "prismjs";
import Editor from "react-simple-code-editor";

import "./codeEditor.css";

interface Props {
	setCode: (code: string) => void;
	code: string;
}

// (;.*)|("(?:[^"]|\\")*")|(:[A-Za-z_][A-Za-z0-9_]*)|([A-Za-z_][A-Za-z0-9_]*)|([!%&*+./<=>?^|\-~]+)|(\d+\.?\d*)|(\n)|([^ ]+?)|( +?)

Prism.languages.stoicos = {
	comment: {
		pattern: /;.*/,
	},
	string: {
		pattern: /("(?:[^"]|\\")*")/,
	},
	symbol: {
		pattern: /(:[A-Za-z_][A-Za-z0-9_]*)/,
	},
	ident: {
		pattern: /([A-Za-z_][A-Za-z0-9_]*)/,
	},
	operator: {
		pattern: /([!%&*+./<=>?^|\-~§£µ¤]+)/,
	},
	number: {
		pattern: /(\d+\.?\d*)/,
	},
	newline: {
		pattern: /(\n)/,
	},
	neutral: {
		pattern: /([^ ]+?)/,
	},
	whitespace: {
		pattern: /( +)/,
	},
};

export default function CodeEditor({ setCode, code }: Props) {
	return (
		<div>
			<Editor
				value={code}
				onValueChange={(code) => setCode(code)}
				highlight={(code) =>
					Prism.highlight(code, Prism.languages.stoicos, "soitcos")
				}
				padding={2}
				style={{
					fontFamily: '"Fira code", "Fira Mono", monospace',
					fontSize: 12,
					backgroundColor: "lightgray",
				}}
			/>
		</div>
	);
}
