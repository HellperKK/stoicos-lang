type CustomBlock =
  | 'comment'
  | 'string'
  | 'symbol'
  | 'ident'
  | 'operator'
  | 'number'
  | 'newLine'
  | 'neutral'
  | 'space';

type CustomColorBlock = {
  type: CustomBlock;
  text: string;
};

function colorize(code: string): Array<CustomColorBlock> {
  const children = new Array<CustomColorBlock>();
  const rule =
    /(;.*)|("(?:[^"]|\\")*")|(:[A-Za-z_][A-Za-z0-9_]*)|([A-Za-z_][A-Za-z0-9_]*)|([!%&*+./<=>?^|\-~]+)|(\d+\.?\d*)|(\n)|([^ ]+?)|( +?)/g;
  // code = code.replace(/\t+/g, code => " ".repeat(code.length * 4))
  code.replace(rule, (...args) => {
    if (args[1]) children.push({ type: 'comment', text: args[1] });
    if (args[2]) children.push({ type: 'string', text: args[2] });
    if (args[3]) children.push({ type: 'symbol', text: args[3] });
    if (args[4]) children.push({ type: 'ident', text: args[4] });
    if (args[5]) children.push({ type: 'operator', text: args[5] });
    if (args[6]) children.push({ type: 'number', text: args[6] });
    if (args[7]) children.push({ type: 'newLine', text: '' });
    if (args[8]) children.push({ type: 'neutral', text: args[8] });
    if (args[9])
      children.push({
        type: 'space',
        text: '.'.repeat(args[9].length),
      });
    return '';
  });
  return children;
}

export { colorize, CustomColorBlock };
