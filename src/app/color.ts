export class Color {
  private _hex: string;
  private _r: number;
  private _g: number;
  private _b: number;

  constructor(hex: string, rgb: { r: number, g: number, b: number }) {
    this._hex = hex;
    this._r = rgb.r;
    this._g = rgb.g;
    this._b = rgb.b;
  }

  get hex() {return this._hex;}
  get r() {return this._r;}
  get g() {return this._g;}
  get b() {return this._b;}

  public static fromHex(hex: string) {
    return new Color(hex, this.hexToRgb(hex));
  }

  public static fromRgb(r: number, g: number, b: number): Color {
    return new Color(this.rgbToHex(r, g, b), { r, g, b });
  }

  private static rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  private static hexToRgb(hex: string): { r: number, g: number, b: number } {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }
}

export class ColorData {

  constructor(
    public color: Color,
    public likes: number,
    public computedLikes: number,
    public error: number) { }
}