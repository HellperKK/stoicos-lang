/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { CustomColorBlock } from './highlighter';
import style from './syntax.css';

function CommentBlock({ attributes, children }: any) {
  return (
    <span className={style.tokenComment} {...attributes}>
      {children}
    </span>
  );
}

function StringBlock({ attributes, children }: any) {
  return (
    <span className={style.tokenString} {...attributes}>
      {children}
    </span>
  );
}

function SymbolBlock({ attributes, children }: any) {
  return (
    <span className={style.tokenSymbol} {...attributes}>
      {children}
    </span>
  );
}

function IdentBlock({ attributes, children }: any) {
  return (
    <span className={style.tokenIdent} {...attributes}>
      {children}
    </span>
  );
}

function OperatorBlock({ attributes, children }: any) {
  return (
    <span className={style.tokenOperator} {...attributes}>
      {children}
    </span>
  );
}

function NumberBlock({ attributes, children }: any) {
  return (
    <span className={style.tokenNumber} {...attributes}>
      {children}
    </span>
  );
}

function NewlineBlock() {
  return <br />;
}

function NeutralBlock({ attributes, children }: any) {
  return <span {...attributes}>{children}</span>;
}

function SpaceBlock({ attributes, children }: any) {
  return (
    <span className={style.tokenSpace} {...attributes}>
      {children}
    </span>
  );
}

function renderElement(block: CustomColorBlock) {
  switch (block.type) {
    case 'comment':
      return <CommentBlock>{block.text}</CommentBlock>;

    case 'string':
      return <StringBlock>{block.text}</StringBlock>;

    case 'symbol':
      return <SymbolBlock>{block.text}</SymbolBlock>;

    case 'ident':
      return <IdentBlock>{block.text}</IdentBlock>;

    case 'operator':
      return <OperatorBlock>{block.text}</OperatorBlock>;

    case 'number':
      return <NumberBlock>{block.text}</NumberBlock>;

    case 'newLine':
      return <NewlineBlock />;

    case 'space':
      return <SpaceBlock>{block.text}</SpaceBlock>;

    default:
      return <NeutralBlock>{block.text}</NeutralBlock>;
  }
}

export default renderElement;
