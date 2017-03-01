import { Component, OnInit } from '@angular/core';
import * as Synaptic from "synaptic";

import { Color, ColorData } from './../color';
import { ColorService } from './../color.service';
import { Network } from './../network';
import { ChartData, ChartColorData } from '../chart/chart-data';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css'],
  providers: [ColorService]
})
export class TrainerComponent implements OnInit {
  private colorsData: ColorData[] = [];
  private errorMessage: string;

  private chartData: ChartData;
  private chartTimer: NodeJS.Timer;

  private network: Network = new Network();
  private maxError: number;

  constructor(private colorService: ColorService) { }

  ngOnInit(): void {
    this.colorService.getColors()
      .subscribe(
      data => this.colorsData = this.colorsData.concat(data).sort((a, b) => b.likes - a.likes),
      error => this.errorMessage = <any>error);
  }

  train(): void {
    this.network.train(this.colorsData);
    this.updateColorStatistic();
  }

  download(): void {
    var data = this.network.json;
    var blob = new Blob([data], { type: 'application/json' });
    var url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  load(event) {
    let files = <File[]>event.srcElement.files;
    if (files.length > 0) {
      let file = files[0];
      console.log(file);
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        this.network.json = reader.result;
        this.updateColorStatistic();
      };
      reader.onerror = function (evt) {
        // document.getElementById("fileContents").innerHTML = "error reading file";
      }
    }
  }

  updateColorStatistic() {
    this.colorsData.forEach(cd => {
      cd.computedLikes = this.network.computeColor(cd.color);
      cd.error = this.network.computeError(cd);
    });
    this.maxError = Math.max(...this.colorsData.map(c => c.error));
    this.restartChartAnimation();
  }

  restartChartAnimation() {
    if(this.chartTimer) {
      clearInterval(this.chartTimer);
    }
    let blue = 0;
    this.chartTimer = setInterval(() => {
      this.drawChart(blue);
      blue = (blue + 5) % 256;
    }, 100);
  }

  drawChart(b: number) {
    let data: ChartColorData[] = [];
      const step = 5;
      for(let r = 0; r <= 255; r += step) {
        for(let g = 0; g <= 255; g += step) {
          let color = Color.fromRgb(r, g, b);
          data.push(new ChartColorData(color, this.network.computeColorNormalize(color)))
        }
      }
      this.chartData = new ChartData(data);
  }
}
