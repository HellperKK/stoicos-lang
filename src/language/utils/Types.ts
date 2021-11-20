/* eslint-disable func-names */
import Type from './Type';

const dynamicType = new Type('dynamic', [], function () {
  return true;
});

const makeArrayType = (type = [dynamicType]) =>
  new Type('array', type, function (token) {
    if (token.type !== this.name) {
      return false;
    }

    const arr = token.request('array');

    return arr.every((tok) => this.parameters[0].compatible(tok));
  });

const makeMapType = (type = [dynamicType, dynamicType]) =>
  new Type('map', type, function (token) {
    if (token.type !== this.name) {
      return false;
    }

    const pairs = Array.from(token.request('map').entries());

    return pairs.every(
      ([key, value]) =>
        this.parameters[0].compatible(key) &&
        this.parameters[1].compatible(value)
    );
  });

const numberType = new Type('number', [], function (token) {
  return token.type === this.name;
});

const boolType = new Type('bool', [], function (token) {
  return token.type === this.name;
});

const stringType = new Type('string', [], function (token) {
  return token.type === this.name;
});

const symbolType = new Type('symbol', [], function (token) {
  return token.type === this.name;
});

const blockType = new Type('block', [], function (token) {
  return token.type === this.name;
});

const structType = new Type('block', [], function (token) {
  return token.type === this.name;
});
const arrayType = makeArrayType();

const mapType = makeMapType();

export {
  dynamicType,
  numberType,
  boolType,
  stringType,
  symbolType,
  blockType,
  arrayType,
  mapType,
  structType,
  makeArrayType,
  makeMapType,
};
