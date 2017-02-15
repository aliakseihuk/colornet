import * as Synaptic from "synaptic";
import { Color } from './color';

export class Network {
  private perceptron: Synaptic.Architect.Perceptron;
  private limit: number;

  get json(): string {
    if(this.perceptron)
      return this.perceptron.toJSON();
  }

  public train(colors: Color[]) {
    this.perceptron = new Synaptic.Architect.Perceptron(3, 10, 10, 1);
    let trainer = new Synaptic.Trainer(this.perceptron);
    this.limit = Math.max(...colors.map(c => c.likes));
    let set = colors.map(c => {
      return {
        input: this.normalizeColor(c),
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

  public compute(color: Color): number {
    return this.perceptron ? this.perceptron.activate(this.normalizeColor(color))[0] * this.limit : 0;
  }

  public computeError(color: Color): number {
    return Math.abs(color.computed - color.likes) / this.limit;
  }

  private normalizeColor(color: Color): number[] {
    const max = 255;
    return [
      color.rgb.red / max,
      color.rgb.green / max,
      color.rgb.blue / max
    ];
  }
}