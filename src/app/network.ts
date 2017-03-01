import * as Synaptic from "synaptic";
import { Color, ColorData } from './color';

export class Network {
  private perceptron: Synaptic.Network;
  private limit: number;

  get json(): string {
    if (this.perceptron) {
      return JSON.stringify({
        limit: this.limit,
        perceptron: this.perceptron.toJSON()
      });
    }
  }

  set json(value: string) {
    let imported: { limit: number, perceptron } = JSON.parse(value);
    this.limit = imported.limit;
    this.perceptron = Synaptic.Network.fromJSON(imported.perceptron)
  }

  public train(colors: ColorData[]) {
    this.perceptron = new Synaptic.Architect.Perceptron(3, 5, 5, 1);
    let trainer = new Synaptic.Trainer(this.perceptron);
    this.limit = Math.max(...colors.map(c => c.likes));
    let set = colors.map(c => {
      return {
        input: this.normalizeColor(c.color),
        output: [c.likes / this.limit]
      }
    });

    let options = {
      rate: .05,
      iterations: 50000,
      error: .005,
      shuffle: true,
      log: 10000,
      cost: Synaptic.Trainer.cost.CROSS_ENTROPY
    };

    let result = trainer.train(set, options);
    console.log(result);
  }

  public computeColor(color: Color): number {
    return this.computeRgb(color.r, color.g, color.b);
  }

  public computeColorNormalize(color: Color): number {
    return this.computeRgbNormalize(color.r, color.g, color.b);
  }

  public computeRgb(red: number, green: number, blue: number): number {
    return this.computeRgbNormalize(red, green, blue) * this.limit;
  }

  private computeRgbNormalize(red: number, green: number, blue: number): number {
    return this.perceptron ? this.perceptron.activate(this.normalizeRgb(red, green, blue))[0] : 0;
  }

  public computeError(colorData: ColorData): number {
    return Math.abs(colorData.computedLikes - colorData.likes) / this.limit;
  }

  private normalizeColor(color: Color): number[] {
    return this.normalizeRgb(color.r, color.g, color.b);
  }

  private normalizeRgb(red: number, green: number, blue: number): number[] {
    const max = 255;
    return [
      red / max,
      green / max,
      blue / max
    ];
  }
}