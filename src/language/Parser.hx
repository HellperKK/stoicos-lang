package language;

import language.tokens.StructAccesToken;
import language.tokens.SymbolToken;
import language.tokens.BlockToken;
import language.tokens.ArrayModelToken;
import language.tokens.NumberToken;
import language.tokens.BaseToken;
import language.tokens.VariableToken;
import language.tokens.CallToken;
import language.tokens.StringToken;

using StringTools;

class Parser {
	public static function parse(code:String):Array<BaseToken> {
		var tokens:Array<String> = [];
		var i = 0;

		while (i < code.length) {
			if (code.isSpace(i)) {
				i ++;
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

		return tokens.map(toToken);
	}

	private static function parseComment(code:String, i:Int) {
		while (code.charAt(i) != "\n" && i < code.length) {
			i++;
		}

		return i;
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
				throw 'Missing bloc termination ${closeChar}';
			}

			var char = code.charAt(i);
			if (char == ";") {
				i = parseComment(code, i);
			}

			if (char == "\"") {
				i = parseString(code, i + 1);
				continue;
			}

			if (char == openChar) {
				openCount++;
			}

			if (char == closeChar) {
				openCount--;
			}

			i++;
		}

		return i;
	}

	private static function parseElement(code:String, i:Int) {
		while (!code.isSpace(i) && i < code.length) {
			var char = code.charAt(i);
			if (char == ";") {
				break;
			}

			if (char == "\"") {
				i = parseString(code, i + 1);
			}

			if (char == "(") {
				i = parseBlock(code, i + 1, "(", ")");
				continue;
			}

			if (char == "{") {
				i = parseBlock(code, i + 1, "{", "}");
				continue;
			}

			if (char == "[") {
				i = parseBlock(code, i + 1, "[", "]");
				continue;
			}

			i++;
		}

		return i;
	}

	private static function toToken(content:String):BaseToken {
		var char = content.charAt(0);

		if (char == "\"") {
			return new StringToken(content.substr(1, content.length - 2));
		}

		if (char == "(") {
			return new CallToken(parse(content.substr(1, content.length - 2)));
		}

		if (char == "[") {
			return new ArrayModelToken(parse(content.substr(1, content.length - 2)));
		}

		if (char == "{") {
			return new BlockToken(parse(content.substr(1, content.length - 2)));
		}

		if (~/^:\(/.match(content)) {
			return new BlockToken([new CallToken(parse(content.substr(2, content.length - 3)))]);
		}

		if (~/^:[A-Za-z_][A-Za-z0-9_]*$/.match(content)) {
			return new SymbolToken(content.substr(1));
		}

		var rule = new EReg("^:[!%&*+/<=>?^|-~§£µ¤]+$", "");
		if (rule.match(content)) {
			return new SymbolToken(content.substr(1));
		}

		if (~/^[A-Za-z_][A-Za-z0-9_]*$/.match(content)) {
			return new VariableToken(content);
		}

		var rule = new EReg("^[!%&*+/<=>?^|\\-~§£µ¤]+$", "");
		if (rule.match(content)) {
			return new VariableToken(content);
		}

		var rule = ~/^([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*)$/;
		if (rule.match(content)) {
			return new StructAccesToken(rule.matched(1), rule.matched(2));
		}

		var rule = new EReg("^([A-Za-z_][A-Za-z0-9_]*)\\.([!%&*+/<=>?^|\\-~§£µ¤]+)$", "");
		if (rule.match(content)) {
			return new StructAccesToken(rule.matched(1), rule.matched(2));
		}

		var rule = ~/^-?[0-9]+(.[0-9]*)?$/;
		if (rule.match(content)) {
			return new NumberToken(Std.parseFloat(content));
		}

        throw 'uknown content ${content}, did you miss some space ?';
	}
}
