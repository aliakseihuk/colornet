import { Component, OnInit } from '@angular/core';
import * as Synaptic from "synaptic";

import { Color } from './../color';
import { ColorService } from './../color.service';
import { Network } from './../network';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css']
})
export class TrainerComponent implements OnInit {
  private colors: Color[] = [];
  private errorMessage: string;
  
  private network: Network = new Network();
  private maxError: number;

  constructor(private colorService: ColorService) {}

  ngOnInit(): void {
    this.colorService.getColors()
      .subscribe(
      colors => this.colors = this.colors.concat(colors).sort((a, b) => b.likes - a.likes),
      error => this.errorMessage = <any>error);
  }

  train(): void {
    this.network.train(this.colors);
    this.colors.forEach(color => {
      color.computed = this.network.compute(color);
      color.error = this.network.computeError(color);
    });
    this.maxError = Math.max(...this.colors.map(c => c.error));
  }

  download(): void {
    var data = JSON.stringify(this.network.json);
    var blob = new Blob([data], { type: 'application/json' });
    var url= window.URL.createObjectURL(blob);
    window.open(url);
  }
}
