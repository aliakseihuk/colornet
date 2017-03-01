import { ColorData, Color} from "../color"

export class ChartColorData {
  constructor(public color, public level) {

  }
}

export class ChartData {
  constructor(public data: ChartColorData[]) {}
}