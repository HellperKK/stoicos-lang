package language.definitions.gameModule;

import openfl.text.TextFieldAutoSize;
import openfl.text.TextField;
import openfl.text.TextFormat;
import openfl.text.TextFieldType;
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
	private var sprites:Map<String, BitmapData>;
	private var texts:Map<String, BitmapData>;

	public function new(module:Map<String, Value>) {
		super();

		this.module = module;
		this.state = module.get("initial_state");
		this.inputs = [new Map<String, Bool>(), new Map<String, Bool>()];
		this.sprites = new Map<String, BitmapData>();
		this.texts = new Map<String, BitmapData>();

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
		state = module.get("update").call([state, getInputs()]);

		var drawings:Array<Value> = module.get("draw").call([state]).request("array");

		window.stage.removeChildren();
		for (drawing in drawings) {
			var drawStruct:Map<String, Value> = drawing.request("struct");
			var type = drawStruct.get("type").request("string");
			if (type == "sprite") {
				var path:String = drawStruct.get("name").request("string");

				var bitmapData:BitmapData;

				if (this.sprites.exists(path)) {
					bitmapData = this.sprites.get(path);
				} else {
					bitmapData = BitmapData.fromFile(path);
					this.sprites.set(path, bitmapData);
				}

				var bitmap = new Bitmap(bitmapData);
				bitmap.x = drawStruct.get("x").request("number");
				bitmap.y = drawStruct.get("y").request("number");
				window.stage.addChild(bitmap);
			} /* else if (type == "text") {
				var textContent = drawStruct.get("content").request("string");
				var x = drawStruct.get("x").request("number");
				var y = drawStruct.get("y").request("number");

				var bitmapData:BitmapData;

				if (this.texts.exists(textContent)) {
					bitmapData = this.texts.get(textContent);
				} else {
					// Render text to BitmapData instead of using TextField
					var textField = new TextField();
					textField.width = 500;
					textField.height = 200;
					textField.wordWrap = true;
					textField.multiline = true;

					var format = new TextFormat();
					format.color = 0x000000;
					format.size = 14;
					textField.defaultTextFormat = format;
					textField.text = "hello world";

					bitmapData = new BitmapData(500, 200, true, 0xFFFFFF);
					bitmapData.draw(textField);

					this.texts.set(textContent, bitmapData);
				}

				var textBitmapDisplay = new Bitmap(bitmapData);
				textBitmapDisplay.x = 100;
				textBitmapDisplay.y = 100;
				window.stage.addChild(textBitmapDisplay);
			}  */else {
				throw 'unsupported type ${type} to display on screen';
			}
		}

		inputs.unshift(inputs[0].copy());
		inputs.pop();
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

		module.set("pressed", new FunctionToken(values -> {
			var name = values[0].request("symbol");

			var pressed = inputs[0].get(name) ?? false;

			return new BooleanToken(pressed);
		}, 1));
		module.set("just_pressed", new FunctionToken(values -> {
			var name = values[0].request("symbol");

			var pressed = inputs[0].get(name) ?? false;
			var previousPressed = inputs[1].get(name) ?? false;

			return new BooleanToken(pressed && ! previousPressed);
		}, 1));

		return new StructToken(module);
	}
}
