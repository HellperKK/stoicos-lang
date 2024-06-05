/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback, useMemo } from "react";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { Text, createEditor, Descendant, BaseEditor, Node } from "slate";
import { withHistory } from "slate-history";
import { css } from "@emotion/css";

import { CustomBlock, colorize } from "./highlighter";

type CustomText = { text: string };
type CustomElement = { type: CustomBlock; children: CustomText[] };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface CompProps {
  setCode: (code: string) => void;
}

const initialValue: Descendant[] = [
  { type: "neutral", children: [{ text: "" }] },
];

const getLength = (token: any) => {
  if (typeof token === "string") {
    return token.length;
  }
  if (typeof token.content === "string") {
    return token.content.length;
  }
  return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
};

const nodesString = (nodes: Array<Descendant>) =>
  nodes.map((n) => Node.string(n)).join("\n");

const Leaf = ({ attributes, children, leaf }: any) => {
  return (
    <span
      spellCheck={false}
      {...attributes}
      className={css`
        font-family: monospace;
        caret-color: white;

        ${leaf.symbol &&
        css`
          color: #4adac4;
        `}

        ${leaf.string &&
        css`
          color: #daa34a;
        `}
        ${leaf.ident &&
        css`
          color: #4a60da;
        `}
        ${leaf.operator &&
        css`
          color: #da4a4a;
        `}
        ${leaf.number &&
        css`
          color: #4fda4a;
        `}
        ${leaf.group &&
        css`
          color: #da4ac7;
        `}
        ${leaf.neutral &&
        css`
          color: white;
        `}
      `}
    >
      {children}
    </span>
  );
};

function CodeHighlightingExample(props: CompProps) {
  const { setCode } = props;

  const [value, setValue] = useState<Descendant[]>(initialValue);
  const renderLeaf = useCallback((_props: any) => <Leaf {..._props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const decorate = useCallback(([node, path]: any) => {
    const ranges: Array<any> = [];
    if (!Text.isText(node)) {
      return ranges;
    }
    const tokens = colorize(node.text);
    let start = 0;

    tokens.forEach((token) => {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          size: token.content.length ?? 0,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    });

    return ranges;
  }, []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(val) => {
        setValue(val);
        setCode(nodesString(val));
      }}
    >
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        className={css`
          background-color: #181716;
          padding: 4px 8px;
        `}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            editor.insertText(" ".repeat(4));
          }
          /*
          if (e.key === "(") {
            e.preventDefault();
            if (window.getSelection !== null) {
              editor.insertText(`(${window.getSelection()?.toString()})`);
            }
          }
          if (e.key === "{") {
            e.preventDefault();
            if (window.getSelection !== null) {
              editor.insertText(`{${window.getSelection()?.toString()}}`);
            }
          }
          if (e.key === "[") {
            e.preventDefault();
            if (window.getSelection !== null) {
              editor.insertText(`[${window.getSelection()?.toString()}]`);
            }
          }
          if (e.key === '"') {
            e.preventDefault();
            if (window.getSelection !== null) {
              editor.insertText(`"${window.getSelection()?.toString()}"`);
            }
          }
          */
        }}
        placeholder="Write some code..."
      />
    </Slate>
  );
}

export default CodeHighlightingExample;
