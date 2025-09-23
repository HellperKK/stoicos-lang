import { unitType } from "../utils/Types";
import BaseToken from "./BaseToken";

export default class UnitToken extends BaseToken {
	public constructor() {
		super("unit", "unit");
	}

	// eslint-disable-next-line class-methods-use-this
	public getType() {
		return unitType;
	}
}
