import BaseToken from "./BaseToken"

export default class UnitToken extends BaseToken {
    public value: String

    public constructor() {
        super("unit", "unit")
    }
}