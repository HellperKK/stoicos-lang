package;

import language.definitions.Prelude;
import language.Parser;
import sys.io.File;

class Main extends mcli.CommandLine {
    public function help()
	{
		Sys.println(this.showUsage());
		Sys.exit(0);
	}

	public function run(fileName:String)
	{
        var code = File.getContent(fileName);
        var tokens = Parser.parse(code);
		Prelude.load();
        for (token in tokens) {
            token.getValue();
        }
	}

	public function version() {
		Sys.println("Stoicos version 1.2.0");
	}

	public static function main()
	{
		new mcli.Dispatch(Sys.args()).dispatch(new Main());
	}
}

