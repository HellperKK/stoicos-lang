package language.definitions.gameModule;

import lime.graphics.RenderContext;
import openfl.display.Application;
import openfl.display.Bitmap;
import openfl.display.BitmapData;

class Window extends Application {
	private var module:Map<String, Value>;
	private var state:Value;

	public function new(module:Map<String, Value>) {
		super();

		this.module = module;
		this.state = module.get("initial_state");

		#if native
		createWindow({
			width: Math.floor(module.get("width").request("number")),
			height: Math.floor(module.get("height").request("number"))
		});
		#elseif html5
		createWindow({width: 550, height: 400, element: js.Browser.document.getElementById("content")});
		#end
	}

	public override function render(context:RenderContext) {
		window.stage.removeChildren();

		state = module.get("update").call([state]);

		var drawings:Array<Value> = module.get("draw").call([state]).request("array");

        for (drawing in drawings) {
            var drawStruct: Map<String, Value> = drawing.request("struct");

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
}
