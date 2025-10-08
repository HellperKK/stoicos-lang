package language.definitions.gameModule;

import language.tokens.FunctionToken;
import language.tokens.BooleanToken;
import language.tokens.StructToken;
import language.tokens.NumberToken;
import openfl.events.MouseEvent;
import openfl.events.KeyboardEvent;
import lime.app.Event;
import lime.graphics.RenderContext;
import openfl.display.Application;
import openfl.display.Bitmap;
import openfl.display.BitmapData;

class Window extends Application {
	private var module:Map<String, Value>;
	private var state:Value;
	private var inputs:Array<Map<String, Bool>>;

	public function new(module:Map<String, Value>) {
		super();

		this.module = module;
		this.state = module.get("initial_state");
		this.inputs = [new Map<String, Bool>(), new Map<String, Bool>()];

		#if native
		createWindow({
			width: Math.floor(module.get("width").request("number")),
			height: Math.floor(module.get("height").request("number")),
			title: module.get("title").request("string")
		});

		window.stage.addEventListener(KeyboardEvent.KEY_DOWN, (listener) -> {
			var name = keynameFromKeycode(listener.keyCode);
			inputs[0].set(name, true);
		});
		window.stage.addEventListener(KeyboardEvent.KEY_UP, (listener) -> {
			var name = keynameFromKeycode(listener.keyCode);
			inputs[0].set(name, false);
		});

		window.stage.addEventListener(MouseEvent.MOUSE_DOWN, (listener) -> {
			inputs[0].set("mouse_left", true);
		});
		window.stage.addEventListener(MouseEvent.MOUSE_UP, (listener) -> {
			inputs[0].set("mouse_left", false);
		});

		window.stage.addEventListener(MouseEvent.MIDDLE_MOUSE_DOWN, (listener) -> {
			inputs[0].set("mouse_middle", true);
		});
		window.stage.addEventListener(MouseEvent.MIDDLE_MOUSE_UP, (listener) -> {
			inputs[0].set("mouse_middle", false);
		});


		window.stage.addEventListener(MouseEvent.RIGHT_MOUSE_UP, (listener) -> {
			inputs[0].set("mouse_right", false);
		});
		window.stage.addEventListener(MouseEvent.RIGHT_MOUSE_DOWN, (listener) -> {
			inputs[0].set("mouse_right", true);
		});

		#elseif html5
		createWindow({width: 550, height: 400, element: js.Browser.document.getElementById("content")});
		#end
	}

	public override function render(context:RenderContext) {
		inputs.unshift(inputs[0].copy());
		inputs.pop();

		state = module.get("update").call([state, getInputs()]);

		var drawings:Array<Value> = module.get("draw").call([state]).request("array");

		window.stage.removeChildren();
		for (drawing in drawings) {
			var drawStruct:Map<String, Value> = drawing.request("struct");

			var bitmap = new Bitmap(BitmapData.fromFile(drawStruct.get("name").request("string")));
			bitmap.x = drawStruct.get("x").request("number");
			bitmap.y = drawStruct.get("y").request("number");
			window.stage.addChild(bitmap);
		}
	}

	public static function main(module:Map<String, Value>) {
		var app = new Window(module);
		return app.exec();
	}

	private static function keynameFromKeycode(code:Int) {
		return switch (code) {
			case 32: "space";
			case 13: "enter";
			case 8: "backspace";
			case 9: "tab";
			case 37: "left";
			case 38: "up";
			case 39: "right";
			case 40: "down";
			case 112: "F1";
			case 113: "F2";
			case 114: "F3";
			case 115: "F4";
			case 116: "F5";
			case 117: "F6";
			case 118: "F7";
			case 119: "F8";
			case 120: "F9";
			case 121: "F10";
			case 122: "F11";
			case 123: "F12";
			default: String.fromCharCode(code).toLowerCase();
		}
	}

	private function getInputs() {
		var module = new Map<String, Value>();
		var mouseModule = new Map<String, Value>();

		mouseModule.set("x", new NumberToken(window.stage.mouseX));
		mouseModule.set("y", new NumberToken(window.stage.mouseY));
		module.set("mouse", new StructToken(mouseModule));

		for (key in inputs[0].keys()) {
			var keyModule = new Map<String, Value>();
			var pressed = inputs[0].get(key) ?? false;
			var previousPressed = inputs[1].get(key) ?? false;

			keyModule.set("pressed", new BooleanToken(pressed));
			keyModule.set("just_pressed", new BooleanToken(pressed && ! previousPressed));

			module.set(key, new StructToken(keyModule));
		}

		module.set("get_input", new FunctionToken(values -> {
			var name = values[0].request("symbol");
			var pression = values[1].request("symbol");

			var inputModule = new Map<String, Value>();

			var pressed = inputs[0].get(name) ?? false;
			var previousPressed = inputs[1].get(name) ?? false;

			return switch (pression) {
				case "pressed": new BooleanToken(pressed);
				case "just_pressed": new BooleanToken(pressed && ! previousPressed);
				default: throw 'unsupported pression ${pression}';
			}
		}, 1));

		return new StructToken(module);
	}
}
