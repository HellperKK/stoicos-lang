package language.tokens;

interface BaseToken {
    public function getValue(): Value;
	public function capture():BaseToken;
}