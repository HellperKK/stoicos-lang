/* eslint-disable no-plusplus */
import BaseToken from "../tokens/BaseToken";
import FunToken from "../tokens/FunToken";
import StructToken from "../tokens/StructToken";
import VarManager from "../manager/VarManager";
import NumberToken from "../tokens/NumberToken";

class Canva {
  static instance: Canva | null = null;

  static getInstance() {
    if (this.instance == null) {
      throw new Error("Canva not initialized");
    }

    return this.instance;
  }

  static init(width: number, height: number) {
    this.instance = new Canva(width, height);
  }

  width: number;
  height: number;
  canva: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canva = document.createElement("canvas");
    this.canva.width = width;
    this.canva.height = height;
    const c = this.canva.getContext("2d");

    if (!c) {
      throw new Error("context not found");
    }

    this.context = c;
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  drawRect(x: number, y: number, width: number, height: number, color: string) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  }

  drawPixel(x: number, y: number, color: string) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, 1, 1);
  }

  print() {
    return `<img src="${this.canva.toDataURL()}">`
  }
}

const canvaInit = () => {
  const { stdOut } = VarManager;
  const module = new Map<string, BaseToken>();

  module.set(
    "init",
    FunToken.native((toks) => {
      const width = toks[0].request("number");
      const height = toks[1].request("number");
      
      Canva.init(width, height);

      return VarManager.unit;
    })
  );
  module.set(
    "drawRect",
    FunToken.native((toks) => {
      const x = toks[0].request("number");
      const y = toks[1].request("number");
      const width = toks[2].request("number");
      const height = toks[3].request("number");
      const color = toks[4].request("string");

      const canva = Canva.getInstance();
      
      canva.drawRect(x, y, width, height, color);

      return VarManager.unit;
    })
  );
  module.set(
    "drawPixel",
    FunToken.native((toks) => {
      const x = toks[0].request("number");
      const y = toks[1].request("number");
      const color = toks[4].request("string");

      const canva = Canva.getInstance();
      
      canva.drawPixel(x, y, color);

      return VarManager.unit;
    })
  );

  module.set(
    "print",
    FunToken.native((toks) => {
      const canva = Canva.getInstance();
      
      stdOut.content += canva.print();

      return VarManager.unit;
    })
  );
  
  return new StructToken(module);
};

export default canvaInit;
