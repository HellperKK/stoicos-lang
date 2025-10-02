package language;

class Parser {
	public static function parse(code:String) {
		var tokens:Array<String> = [];
		var i = 0;

		while (i < code.length) {
			var rule = ~/\s+/m;
			if (rule.matchSub(code, i) && rule.matchedPos().pos == i) {
				i += rule.matched(0).length;
				continue;
			}

			var char = code.charAt(i);

			if (char == ";") {
				i = parseComment(code, i);
			} else if (char == "\"") {
				var endString = parseString(code, i + 1);
				tokens.push(code.substring(i, endString));
				i = endString;
			} else if (char == "(") {
				var endBlock = parseBlock(code, i + 1, "(", ")");
				tokens.push(code.substring(i, endBlock));
				i = endBlock;
			} else if (char == "{") {
				var endBlock = parseBlock(code, i + 1, "{", "}");
				tokens.push(code.substring(i, endBlock));
				i = endBlock;
			} else if (char == "[") {
				var endBlock = parseBlock(code, i + 1, "[", "]");
				tokens.push(code.substring(i, endBlock));
				i = endBlock;
			} else {
				var endElement = parseElement(code, i);
				tokens.push(code.substring(i, endElement));
				i = endElement;
			}
		}

		return tokens;
	}

	private static function parseComment(code:String, i:Int) {
		while (code.charAt(i) != "\n" && i < code.length) {
			i++;
		}

		return i - 1;
	}

	private static function parseString(code:String, i:Int) {
		while (code.charAt(i) != "\"") {
			if (i == code.length) {
				throw "Missing string termination";
			}

			if (code.charAt(i) == "\\") {
				i += 2;
				continue;
			}

			i++;
		}

		return i + 1;
	}

	private static function parseBlock(code:String, i:Int, openChar:String, closeChar:String) {
		var openCount = 1;
		while (openCount > 0) {
			if (i == code.length) {
				throw "Missing bloc termination";
			}

			var char = code.charAt(i);
			if (char == ";") {
				i = parseComment(code, i);
			}

			if (char == "\"") {
				i = parseString(code, i + 1);
			}

			if (char == openChar) {
				openCount++;
			}

			if (char == closeChar) {
				openCount--;
			}

			i++;
		}

		return i + 1;
	}

	private static function parseElement(code:String, i:Int) {
		while (code.charAt(i) != " " && i < code.length) {
			var char = code.charAt(i);
			if (char == ";") {
				break;
			}

			if (char == "\"") {
				i = parseString(code, i + 1);
			}

			if (char == "(") {
				i = parseBlock(code, i + 1, "(", ")");
			}

			if (char == "{") {
				i = parseBlock(code, i + 1, "{", "}");
			}

			if (char == "[") {
				i = parseBlock(code, i + 1, "[", "]");
			}

			i++;
		}

		return i;
	}
}
